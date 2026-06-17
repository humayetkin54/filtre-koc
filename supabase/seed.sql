-- Eski seed datayı temizle
truncate coaches;

-- Seed data (department sütunu dahil)
insert into coaches (name, university, department, avatar_initials, avatar_color, avatar_text_color, rating, rating_count, current_students, max_students, net_increase, availability, types, price) values

('Ahmet Yılmaz',   'Boğaziçi Üniversitesi',  'İşletme',                    'AY', '#dde1ff', '#3a4cff', 4.9, 128, 6, 8, '+18 net', 'low',  array['YKS'],        2490),
('Elif Kaya',      'ODTÜ',                    'Psikoloji',                  'EK', '#fce7f3', '#be185d', 4.8,  97, 4, 8, '+14 net', 'open', array['YKS','PDR'],  2990),
('Burak Demir',    'İTÜ',                     'Bilgisayar Mühendisliği',    'BD', '#d1fae5', '#065f46', 4.7,  74, 8, 8, '+11 net', 'full', array['YKS'],        1990),
('Selin Arslan',   'Hacettepe Üniversitesi',  'Matematik',                  'SA', '#fef3c7', '#92400e', 4.8,  83, 3, 8, '+22 net', 'open', array['LGS'],        2490),
('Murat Çelik',    'Ankara Üniversitesi',     'Hukuk',                      'MÇ', '#e0e7ff', '#3730a3', 4.6,  61, 5, 8, '+9 net',  'open', array['KPSS'],       1490),
('Zeynep Öztürk',  'Ege Üniversitesi',        'Tıp',                        'ZÖ', '#fde8ff', '#7c3aed', 4.9, 112, 7, 8, '+16 net', 'low',  array['YKS','LGS'],  3490),
('Emre Şahin',     'Bilkent Üniversitesi',    'İktisat',                    'EŞ', '#fff7ed', '#c2410c', 4.5,  49, 2, 8, '+7 net',  'open', array['KPSS'],       1490),
('Ayşe Koç',       'Marmara Üniversitesi',    'Psikolojik Danışmanlık',     'AK', '#ecfdf5', '#047857', 4.7,  88, 6, 8, '+13 net', 'low',  array['PDR'],        1990),
('Oğuz Yıldız',    'Koç Üniversitesi',        'Endüstri Mühendisliği',      'OY', '#eff6ff', '#1d4ed8', 4.8,  76, 4, 8, '+19 net', 'open', array['YKS'],        3990),
('Fatma Aydın',    'Sabancı Üniversitesi',    'Eğitim Bilimleri',           'FA', '#f0fdf4', '#15803d', 4.6,  55, 8, 8, '+10 net', 'full', array['LGS','PDR'],  2490),
('Caner Polat',    'Gazi Üniversitesi',       'Kamu Yönetimi',              'CP', '#fdf4ff', '#a21caf', 4.7,  67, 3, 8, '+12 net', 'open', array['KPSS'],       1990),
('Melis Güneş',    'İstanbul Üniversitesi',   'Sosyoloji',                  'MG', '#fff1f2', '#be123c', 4.9,  94, 7, 8, '+21 net', 'low',  array['YKS','KPSS'], 2990);

-- RLS: herkese okuma izni (henüz eklenmemişse)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'coaches' and policyname = 'Coaches are publicly readable'
  ) then
    execute 'create policy "Coaches are publicly readable" on coaches for select using (true)';
  end if;
end $$;
