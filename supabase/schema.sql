-- 医療・介護求人ポータル データベーススキーマ
-- Supabase SQL エディタで実行してください

-- プロフィールテーブル（auth.usersと連携）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'jobseeker' CHECK (role IN ('jobseeker', 'employer', 'admin')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 事業者（企業・施設）テーブル
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  address TEXT,
  prefecture TEXT,
  city TEXT,
  phone TEXT,
  employee_count INTEGER,
  established_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 求人テーブル
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract', 'temporary')),
  employment_status TEXT NOT NULL CHECK (employment_status IN ('正社員', 'パート・アルバイト', '契約社員', '派遣社員')),
  occupation TEXT NOT NULL, -- 職種（看護師、介護士、医師 など）
  prefecture TEXT NOT NULL,
  city TEXT,
  address TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT NOT NULL DEFAULT 'monthly' CHECK (salary_type IN ('hourly', 'monthly', 'annual')),
  working_hours TEXT,
  holidays TEXT,
  benefits TEXT,
  requirements TEXT,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 応募テーブル
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(job_id, applicant_id) -- 同一求人への重複応募を防止
);

-- お気に入り求人テーブル
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, job_id)
);

-- updated_at を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 新規ユーザー登録時にprofilesレコードを自動作成する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'jobseeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.usersへの挿入時にトリガーを起動
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) の有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- profiles ポリシー
CREATE POLICY "プロフィールは全員が閲覧可能" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "自分のプロフィールのみ更新可能" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- companies ポリシー
CREATE POLICY "企業情報は全員が閲覧可能" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "オーナーのみ企業情報を作成可能" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "オーナーのみ企業情報を更新可能" ON public.companies
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "オーナーのみ企業情報を削除可能" ON public.companies
  FOR DELETE USING (auth.uid() = owner_id);

-- jobs ポリシー
CREATE POLICY "公開求人は全員が閲覧可能" ON public.jobs
  FOR SELECT USING (is_published = true OR auth.uid() = (
    SELECT owner_id FROM public.companies WHERE id = company_id
  ));

CREATE POLICY "企業オーナーのみ求人を作成可能" ON public.jobs
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT owner_id FROM public.companies WHERE id = company_id)
  );

CREATE POLICY "企業オーナーのみ求人を更新可能" ON public.jobs
  FOR UPDATE USING (
    auth.uid() = (SELECT owner_id FROM public.companies WHERE id = company_id)
  );

CREATE POLICY "企業オーナーのみ求人を削除可能" ON public.jobs
  FOR DELETE USING (
    auth.uid() = (SELECT owner_id FROM public.companies WHERE id = company_id)
  );

-- applications ポリシー
CREATE POLICY "応募者と企業オーナーのみ閲覧可能" ON public.applications
  FOR SELECT USING (
    auth.uid() = applicant_id OR
    auth.uid() = (
      SELECT c.owner_id FROM public.companies c
      JOIN public.jobs j ON j.company_id = c.id
      WHERE j.id = job_id
    )
  );

CREATE POLICY "求職者のみ応募可能" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "応募者と企業オーナーのみ応募を更新可能" ON public.applications
  FOR UPDATE USING (
    auth.uid() = applicant_id OR
    auth.uid() = (
      SELECT c.owner_id FROM public.companies c
      JOIN public.jobs j ON j.company_id = c.id
      WHERE j.id = job_id
    )
  );

-- saved_jobs ポリシー
CREATE POLICY "自分のお気に入りのみ閲覧可能" ON public.saved_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "自分のお気に入りのみ追加可能" ON public.saved_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分のお気に入りのみ削除可能" ON public.saved_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS jobs_prefecture_idx ON public.jobs(prefecture);
CREATE INDEX IF NOT EXISTS jobs_occupation_idx ON public.jobs(occupation);
CREATE INDEX IF NOT EXISTS jobs_is_published_idx ON public.jobs(is_published);
CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS applications_job_id_idx ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS applications_applicant_id_idx ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS saved_jobs_user_id_idx ON public.saved_jobs(user_id);
