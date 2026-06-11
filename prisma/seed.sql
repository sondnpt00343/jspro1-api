-- Seed data that mirrors the visible Blog UI screens.

BEGIN;

INSERT INTO users (id, name, email, password_hash, status, created_at, updated_at)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Nguyễn Văn A',
  'nguyenvana@example.com',
  '$argon2id$v=19$m=65536,t=3,p=4$QmxvZ1VpU2VlZFBhc3M$GSL9Hlb1ZdeLqWN6Jm7j7fg4yc1QwtJcbOLVxfLJysA',
  'active',
  '2026-04-01 08:00:00+07',
  '2026-04-24 08:00:00+07'
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

INSERT INTO media_assets (id, kind, url, alt_text, width, height, source, created_by)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'image', 'https://picsum.photos/id/1005/112/112', 'Ảnh tác giả', 112, 112, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002', 'image', 'https://picsum.photos/id/1/1200/675', 'Ảnh minh hoạ bài viết', 1200, 675, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000003', 'image', 'https://picsum.photos/id/2/640/360', 'Ảnh minh hoạ: Cấu trúc thư mục gợi ý', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000004', 'image', 'https://picsum.photos/id/3/640/360', 'Ảnh minh hoạ: Tips viết mã sạch', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000005', 'image', 'https://picsum.photos/id/4/640/360', 'Ảnh minh hoạ: Deploy blog tĩnh', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000011', 'image', 'https://picsum.photos/id/11/640/360', 'Ảnh minh hoạ: Giới thiệu dự án blog', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000012', 'image', 'https://picsum.photos/id/12/640/360', 'Ảnh minh hoạ: Cài đặt môi trường phát triển', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000013', 'image', 'https://picsum.photos/id/13/640/360', 'Ảnh minh hoạ: module trong JavaScript', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000014', 'image', 'https://picsum.photos/id/14/640/360', 'Ảnh minh hoạ: TypeScript cho dự án nhỏ', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000015', 'image', 'https://picsum.photos/id/15/640/360', 'Ảnh minh hoạ: Git branch và commit', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000016', 'image', 'https://picsum.photos/id/16/640/360', 'Ảnh minh hoạ: REST API và fetch', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000017', 'image', 'https://picsum.photos/id/17/640/360', 'Ảnh minh hoạ: Docker và môi trường dev', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000018', 'image', 'https://picsum.photos/id/18/640/360', 'Ảnh minh hoạ: kiểm thử giao diện', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000019', 'image', 'https://picsum.photos/id/19/640/360', 'Ảnh minh hoạ: Dựng khung trang tĩnh rồi mở rộng tính năng', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000020', 'image', 'https://picsum.photos/id/20/640/360', 'Ảnh minh hoạ: Cấu trúc thư mục theo tính năng', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000021', 'image', 'https://picsum.photos/id/21/640/360', 'Ảnh minh hoạ: Tên biến rõ, hàm nhỏ, tệp gọn', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000022', 'image', 'https://picsum.photos/id/22/640/360', 'Ảnh minh hoạ: Deploy tĩnh, kiểm path ảnh', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000023', 'image', 'https://picsum.photos/id/23/640/360', 'Ảnh minh hoạ: Biến màu, spacing, font dùng lại cả dự án', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000024', 'image', 'https://picsum.photos/id/24/640/360', 'Ảnh minh hoạ: Tối ưu ảnh theo màn, nén, lazy', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000025', 'image', 'https://picsum.photos/id/25/640/360', 'Ảnh minh hoạ: Label, bàn phím, contrast, focus', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000026', 'image', 'https://picsum.photos/id/26/640/360', 'Ảnh minh hoạ: Tách CSS quan trọng, ưu tiên phần above fold', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000027', 'image', 'https://picsum.photos/id/27/640/360', 'Ảnh minh hoạ: Màu sắc và biến CSS', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000028', 'image', 'https://picsum.photos/id/28/640/360', 'Ảnh minh hoạ: Tối ưu ảnh trên trang tĩnh', 640, 360, 'picsum', '00000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO UPDATE
SET url = EXCLUDED.url,
    alt_text = EXCLUDED.alt_text,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    source = EXCLUDED.source,
    created_by = EXCLUDED.created_by;

INSERT INTO media_variants (id, asset_id, variant_key, url, width, height)
VALUES
  ('11000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'nav-avatar', 'https://picsum.photos/id/1005/72/72', 72, 72),
  ('11000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'sidebar-avatar', 'https://picsum.photos/id/1005/80/80', 80, 80),
  ('11000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'author-avatar', 'https://picsum.photos/id/1005/112/112', 112, 112)
ON CONFLICT (asset_id, variant_key) DO UPDATE
SET url = EXCLUDED.url,
    width = EXCLUDED.width,
    height = EXCLUDED.height;

INSERT INTO user_profiles (user_id, display_name, headline, bio, avatar_asset_id, theme_preference)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Nguyễn Văn A',
  'Lập trình viên front-end',
  'Hay viết ngắn về HTML, CSS và những thứ liên quan tới trang tĩnh. Liên hệ qua trang Liên hệ nếu bạn muốn trao đổi.',
  '10000000-0000-4000-8000-000000000001',
  'system'
)
ON CONFLICT (user_id) DO UPDATE
SET display_name = EXCLUDED.display_name,
    headline = EXCLUDED.headline,
    bio = EXCLUDED.bio,
    avatar_asset_id = EXCLUDED.avatar_asset_id,
    theme_preference = EXCLUDED.theme_preference;

INSERT INTO categories (id, name, slug, description, sort_order, is_active)
VALUES
  ('30000000-0000-4000-8000-000000000001', 'Công nghệ', 'cong-nghe', 'Bài về công cụ, thư viện và vài thứ mình hay dùng khi làm web.', 10, true),
  ('30000000-0000-4000-8000-000000000002', 'Học tập', 'hoc-tap', 'Ghi chú học tập, cấu trúc dự án và cách học bền hơn.', 20, true),
  ('30000000-0000-4000-8000-000000000003', 'Chia sẻ', 'chia-se', 'Kinh nghiệm ngắn từ quá trình viết code và làm giao diện.', 30, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

INSERT INTO tags (id, name, slug, description, sort_order, is_active)
VALUES
  ('40000000-0000-4000-8000-000000000001', 'Front-end / Mobile apps', 'front-end-mobile-apps', 'Bài viết về giao diện web và ứng dụng di động.', 10, true),
  ('40000000-0000-4000-8000-000000000002', 'Back-end / Devops', 'back-end-devops', 'Bài viết về API, server, vận hành và triển khai.', 20, true),
  ('40000000-0000-4000-8000-000000000003', 'Học máy & LLM', 'hoc-may-llm', 'Bài viết về machine learning, AI và mô hình ngôn ngữ.', 30, true),
  ('40000000-0000-4000-8000-000000000004', 'Tester / Testing', 'tester-testing', 'Bài viết về kiểm thử, testcase và chất lượng phần mềm.', 40, true),
  ('40000000-0000-4000-8000-000000000005', 'UI / UX / Design', 'ui-ux-design', 'Bài viết về trải nghiệm người dùng và thiết kế giao diện.', 50, true),
  ('40000000-0000-4000-8000-000000000006', 'Others', 'others', 'Các chủ đề khác.', 60, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

INSERT INTO pages (id, slug, title, lead, body_html, seo_title, meta_description, status)
VALUES
  ('50000000-0000-4000-8000-000000000001', 'home', 'Bài viết mới nhất', 'Tuần này có gì mới, xem tạm ở đây trước khi bạn đào sâu.', '', 'Trang chủ - Blog UI', 'Blog UI hiển thị bài viết mới nhất và chủ đề nổi bật.', 'published'),
  ('50000000-0000-4000-8000-000000000002', 'about', 'Giới thiệu về Blog UI', NULL, $$<p><strong>Blog UI</strong> là bộ giao diện tĩnh: trang chủ, thể loại, bài dài, liên hệ, đăng nhập, viết bài, và bảng màu/Elements cho những thứ chung.</p><h2>Trải nghiệm trên từng thiết bị</h2><p>Bố cục co theo từng bề ngang, từ điện thoại, tablet tới màn lớn.</p><h2>Chế độ tối (dark) và sáng (light)</h2><p>Người đọc có thể chuyển giữa nền sáng và nền tối thuận tiện cho mắt, tùy chỉnh trên trang.</p>$$, 'Giới thiệu - Blog UI', 'Giới thiệu bộ giao diện Blog UI và các trang có trong dự án.', 'published'),
  ('50000000-0000-4000-8000-000000000003', 'contact', 'Liên hệ', 'Gửi tin qua form hoặc xem bản đồ bên cạnh.', '', 'Liên hệ - Blog UI', 'Gửi tin nhắn liên hệ qua Blog UI.', 'published'),
  ('50000000-0000-4000-8000-000000000004', 'login', 'Đăng nhập', NULL, '', 'Đăng nhập - Blog UI', 'Đăng nhập tài khoản Blog UI.', 'published'),
  ('50000000-0000-4000-8000-000000000005', 'register', 'Đăng ký', NULL, '', 'Đăng ký - Blog UI', 'Tạo tài khoản Blog UI.', 'published'),
  ('50000000-0000-4000-8000-000000000006', 'write', 'Viết bài', 'Soạn bài mới. Khối bên dưới dành cho trình soạn thảo - tạm dùng placeholder; sau có thể thay bằng Quill, TinyMCE, v.v.', '', 'Viết bài - Blog UI', 'Soạn, lưu nháp và xuất bản bài viết.', 'published'),
  ('50000000-0000-4000-8000-000000000007', 'my-posts', 'Bài viết của tôi', 'Danh sách bài bạn đã tạo - xem nhanh hoặc mở trang sửa.', '', 'Bài viết của tôi - Blog UI', 'Quản lý bài viết của tài khoản hiện tại.', 'published'),
  ('50000000-0000-4000-8000-000000000008', 'elements', 'UI Elements', 'Nút, toast, cảnh báo inline - gom một chỗ cho form và trang cài đặt.', '', 'Elements - Blog UI', 'Trang demo các thành phần giao diện của Blog UI.', 'published')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    lead = EXCLUDED.lead,
    body_html = EXCLUDED.body_html,
    seo_title = EXCLUDED.seo_title,
    meta_description = EXCLUDED.meta_description,
    status = EXCLUDED.status;

INSERT INTO hero_slides (id, page_id, title, subtitle, link_url, media_asset_id, sort_order, is_active)
VALUES
  ('60000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Bố cục trang trước, chi tiết sau', NULL, '/posts/dung-khung-trang-tinh-sau-do-tich-hop-router-hoac-form-tung-buoc', NULL, 10, true),
  ('60000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000001', 'Gom file cho đỡ lạc', NULL, '/posts/gom-css-theo-tang-dat-ten-thu-muc-goi-nho-muc-dich-su-dung', NULL, 20, true),
  ('60000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000001', 'Gọn code, bớt nợ kỹ thuật', NULL, '/posts/viet-ten-dai-mot-chut-van-on-neu-giup-doc-dung-boi-canh-sua-loi', NULL, 30, true),
  ('60000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000001', 'Tải từng bước, đỡ giật màn hình', NULL, '/posts/goi-tai-nguyen-chinh-som-le-route-phu-tri-hoan-manh-khong-can', NULL, 40, true)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    link_url = EXCLUDED.link_url,
    media_asset_id = EXCLUDED.media_asset_id,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

INSERT INTO navigation_items (id, location, label, href, icon_class, auth_state, sort_order, is_active)
VALUES
  ('70000000-0000-4000-8000-000000000001', 'header_primary', 'Trang chủ', '/', 'fa-solid fa-house', 'any', 10, true),
  ('70000000-0000-4000-8000-000000000002', 'header_primary', 'Giới thiệu', '/about', 'fa-solid fa-circle-info', 'any', 20, true),
  ('70000000-0000-4000-8000-000000000003', 'header_primary', 'Liên hệ', '/contact', 'fa-solid fa-envelope', 'any', 30, true),
  ('70000000-0000-4000-8000-000000000004', 'header_secondary', 'Elements', '/elements', 'fa-solid fa-layer-group', 'any', 10, true),
  ('70000000-0000-4000-8000-000000000005', 'header_secondary', 'Đăng nhập', '/login', 'fa-solid fa-right-to-bracket', 'guest', 20, true),
  ('70000000-0000-4000-8000-000000000006', 'header_secondary', 'Đăng ký', '/register', 'fa-solid fa-user-plus', 'guest', 30, true),
  ('70000000-0000-4000-8000-000000000007', 'user_menu', 'Viết bài', '/me/posts/new', 'fa-solid fa-pen', 'authenticated', 10, true),
  ('70000000-0000-4000-8000-000000000008', 'user_menu', 'Bài viết của tôi', '/me/posts', 'fa-solid fa-file-lines', 'authenticated', 20, true),
  ('70000000-0000-4000-8000-000000000009', 'user_menu', 'Đăng xuất', '/logout', 'fa-solid fa-right-from-bracket', 'authenticated', 30, true),
  ('70000000-0000-4000-8000-000000000010', 'footer', 'Liên hệ', '/contact', NULL, 'any', 10, true)
ON CONFLICT (location, href, auth_state) DO UPDATE
SET label = EXCLUDED.label,
    icon_class = EXCLUDED.icon_class,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

INSERT INTO site_settings (key, value, is_public)
VALUES
  ('brand', '{"name":"Blog UI","icon":"fa-solid fa-pen-nib","homeHref":"/"}'::jsonb, true),
  ('footer', '{"copyright":"© 2026 Blog UI","links":[{"label":"Liên hệ","href":"/contact"}]}'::jsonb, true),
  ('contact', '{"mapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4994603879504!2d105.79999411132681!3d21.012692280551867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4df3c6c329%3A0xd8e14fe61fd32604!2zQ8OUTkcgVFkgQ-G7lCBQSOG6pk4gQ8OUTkcgTkdI4buGIEdJw4FPIEThu6RDIEY4!5e0!3m2!1svi!2s!4v1779465522732!5m2!1svi!2s","mapLabel":"Bản đồ"}'::jsonb, true)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    is_public = EXCLUDED.is_public;

WITH raw_posts AS (
  SELECT * FROM (VALUES
    ('20000000-0000-4000-8000-000000000001'::uuid, 'cong-nghe', 'https://picsum.photos/id/11/640/360', 'Giới thiệu về dự án blog', 'gioi-thieu-ve-du-an-blog', 'Cấu trúc tệp tĩnh, trang mẫu cho từng loại nội dung, và cách tách lớp dữ liệu để sau này cắm API mà không phải viết lại toàn bộ giao diện.', $$<p>Mình bắt đầu với vài trang HTML tĩnh: trang chủ, chi tiết bài, form đăng nhập đơn giản. Chưa cần framework, chỉ cần bố cục gọn là đủ cho vài tuần đầu.</p><p>Phần CSS gom vào reset và một file style chung. Header và footer lặp lại giữa các file cho tới khi muốn tách partial hoặc build bước sau.</p><p>Khi cần thêm tương tác - chẳng hạn menu mobile, gửi form - lúc đó mới nối script vào từng chỗ, tránh nhồi hết vào một file từ đầu.</p>$$, 'published', 5, '2026-04-24 09:00:00+07'::timestamptz, '2026-04-24 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000002'::uuid, 'hoc-tap', 'https://picsum.photos/id/2/640/360', 'Cấu trúc thư mục gợi ý', 'cau-truc-thu-muc-goi-y', 'Gom CSS vào vài file, đặt tên thư mục rõ ràng để lúc mở lại không phải nhớ lại hết.', $$<p>Gom CSS vào vài file, đặt tên thư mục rõ ràng để lúc mở lại không phải nhớ lại hết.</p>$$, 'published', 4, '2026-04-22 09:00:00+07'::timestamptz, '2026-04-22 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000003'::uuid, 'chia-se', 'https://picsum.photos/id/3/640/360', 'Tips viết mã sạch', 'tips-viet-ma-sach', 'Tách hàm nhỏ, đặt tên biến đọc vào là hiểu - tránh để một file phình mãi.', $$<p>Tách hàm nhỏ, đặt tên biến đọc vào là hiểu - tránh để một file phình mãi.</p>$$, 'published', 4, '2026-04-20 09:00:00+07'::timestamptz, '2026-04-20 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000004'::uuid, 'cong-nghe', 'https://picsum.photos/id/4/640/360', 'Deploy blog tĩnh lên trang thử nghiệm', 'deploy-blog-tinh-len-trang-thu-nghiem', 'Chọn nơi host miễn phí, gắn tên miền phụ nếu cần, và kiểm tra lại link ảnh tương đối từng bước.', $$<p>Chọn nơi host miễn phí, gắn tên miền phụ nếu cần, và kiểm tra lại link ảnh tương đối từng bước.</p>$$, 'published', 4, '2026-04-18 09:00:00+07'::timestamptz, '2026-04-18 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000005'::uuid, 'cong-nghe', 'https://picsum.photos/id/27/640/360', 'Màu sắc và biến CSS', 'mau-sac-va-bien-css', 'Ghi chú về cách gom màu sắc, khoảng cách và token CSS để đổi giao diện nhất quán hơn.', $$<p>Ghi chú về cách gom màu sắc, khoảng cách và token CSS để đổi giao diện nhất quán hơn.</p>$$, 'draft', 3, NULL::timestamptz, '2026-04-16 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000006'::uuid, 'hoc-tap', 'https://picsum.photos/id/28/640/360', 'Tối ưu ảnh trên trang tĩnh', 'toi-uu-anh-tren-trang-tinh', 'Ghi chú về kích thước ảnh, lazy load và cách giữ layout ổn định trên trang tĩnh.', $$<p>Ghi chú về kích thước ảnh, lazy load và cách giữ layout ổn định trên trang tĩnh.</p>$$, 'draft', 3, NULL::timestamptz, '2026-04-12 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000011'::uuid, 'cong-nghe', 'https://picsum.photos/id/12/640/360', 'Cài đặt môi trường phát triển', 'cai-dat-moi-truong-phat-trien', 'Node, trình soạn, tiện ích mở nhanh, và cách bật live reload để mỗi lần sửa file thấy kết quả gần như tức thì, tránh reload tay khi sửa từng dòng.', $$<p>Node, trình soạn, tiện ích mở nhanh, và cách bật live reload để mỗi lần sửa file thấy kết quả gần như tức thì.</p>$$, 'published', 4, '2026-04-23 09:00:00+07'::timestamptz, '2026-04-23 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000012'::uuid, 'cong-nghe', 'https://picsum.photos/id/13/640/360', 'Làm quen với module trong JS', 'lam-quen-voi-module-trong-js', 'Phân tách tệp theo chức năng, dùng import/export, và giữ đường dẫn ổn khi tăng số tệp để mỗi mảnh nhỏ dễ test và tái sử dụng.', $$<p>Phân tách tệp theo chức năng, dùng import/export, và giữ đường dẫn ổn khi tăng số tệp.</p>$$, 'published', 4, '2026-04-21 09:00:00+07'::timestamptz, '2026-04-21 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000013'::uuid, 'cong-nghe', 'https://picsum.photos/id/14/640/360', 'TypeScript cho dự án nhỏ, bắt đầu từ cấu hình tối thiểu', 'typescript-cho-du-an-nho-bat-dau-tu-cau-hinh-toi-thieu', 'Bật strict, tách tệp khai báo type, dùng path alias để import gọn, và tránh bật tùy chọn dư khi bạn còn đang tập cú pháp cơ bản.', $$<p>Bật strict, tách tệp khai báo type, dùng path alias để import gọn, và tránh bật tùy chọn dư.</p>$$, 'published', 5, '2026-04-19 09:00:00+07'::timestamptz, '2026-04-19 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000014'::uuid, 'cong-nghe', 'https://picsum.photos/id/15/640/360', 'Nhánh Git rõ, commit nhỏ, mô tả dòng đủ cho ngày hôm sau', 'nhanh-git-ro-commit-nho-mo-ta-dong-du-cho-ngay-hom-sau', 'Đặt tên branch theo tính năng, rebase cẩn thận trước khi mở PR, ghi ngắn gắn với số công việc để lịch sử đọc lại mà vẫn thấy mạch công việc.', $$<p>Đặt tên branch theo tính năng, rebase cẩn thận trước khi mở PR, ghi ngắn gắn với số công việc.</p>$$, 'published', 4, '2026-04-17 09:00:00+07'::timestamptz, '2026-04-17 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000015'::uuid, 'cong-nghe', 'https://picsum.photos/id/16/640/360', 'Gọi API thử, xử lý lỗi 4xx/5xx và tải lại có kiểm soát', 'goi-api-thu-xu-ly-loi-4xx-5xx-va-tai-lai-co-kiem-soat', 'Dùng fetch với chế độ JSON, tách hàm parse, bắt lỗi mạng tách với dữ liệu không hợp lệ, rồi mới cắm vào thẻ tải trên giao diện.', $$<p>Dùng fetch với chế độ JSON, tách hàm parse, bắt lỗi mạng tách với dữ liệu không hợp lệ.</p>$$, 'published', 5, '2026-04-15 09:00:00+07'::timestamptz, '2026-04-15 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000016'::uuid, 'cong-nghe', 'https://picsum.photos/id/17/640/360', 'Một file Dockerfile, volume cho mã nguồn, cùng lệnh chạy dev', 'mot-file-dockerfile-volume-cho-ma-nguon-cung-lenh-chay-dev', 'Giữ bản môi trường trùng thư viện với sản xuất, bớt câu hỏi ở tôi chạy được mà bạn thì lỗi, và tài liệu hoá từng bước cài extension cần thiết.', $$<p>Giữ bản môi trường trùng thư viện với sản xuất và tài liệu hoá từng bước cài extension cần thiết.</p>$$, 'published', 4, '2026-04-14 09:00:00+07'::timestamptz, '2026-04-14 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000017'::uuid, 'cong-nghe', 'https://picsum.photos/id/18/640/360', 'Bộ công cụ kiểm thử: tiêu chí, thiết bị, và tình huống lặp thường gặp', 'bo-cong-cu-kiem-thu-tieu-chi-thiet-bi-va-tinh-huong-lap-thuong-gap', 'Liệt kê luồng hạnh phúc, luồng lỗi, so khung viewport vài kích thước, chụp màn hình bất thường gửi cùng mã lỗi để cả team dễ tái hiện.', $$<p>Liệt kê luồng hạnh phúc, luồng lỗi, so khung viewport vài kích thước và chụp màn hình bất thường.</p>$$, 'published', 5, '2026-04-13 09:00:00+07'::timestamptz, '2026-04-13 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000021'::uuid, 'cong-nghe', 'https://picsum.photos/id/19/640/360', 'Dựng khung trang tĩnh, sau đó tích hợp router hoặc form từng bước', 'dung-khung-trang-tinh-sau-do-tich-hop-router-hoac-form-tung-buoc', 'Làm layout trước, tách dữ liệu sau, mỗi bước cập nhật một mảnh thì dễ sửa lỗi hơn là nhồi hết vào từ đầu.', $$<p>Làm layout trước, tách dữ liệu sau, mỗi bước cập nhật một mảnh thì dễ sửa lỗi hơn là nhồi hết vào từ đầu.</p>$$, 'published', 4, '2026-04-30 09:00:00+07'::timestamptz, '2026-04-30 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000022'::uuid, 'hoc-tap', 'https://picsum.photos/id/20/640/360', 'Gom CSS theo tầng, đặt tên thư mục gợi nhớ mục đích sử dụng', 'gom-css-theo-tang-dat-ten-thu-muc-goi-nho-muc-dich-su-dung', 'Reset, lưới, style trang, component nên ở các tệp tách bạch, tránh nhồi một nơi. Mỗi lần cần sửa, bạn mở đúng tệp thay vì tìm xuyên cả cây thư mục hay đổi tên theo từng cảm hứng nhất thời.', $$<p>Reset, lưới, style trang, component nên ở các tệp tách bạch, tránh nhồi một nơi.</p>$$, 'published', 4, '2026-04-29 09:00:00+07'::timestamptz, '2026-04-29 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000023'::uuid, 'chia-se', 'https://picsum.photos/id/21/640/360', 'Viết tên dài một chút vẫn ổn nếu giúp đọc đúng bối cảnh sửa lỗi', 'viet-ten-dai-mot-chut-van-on-neu-giup-doc-dung-boi-canh-sua-loi', 'Chia nhỏ hành vi thành hàm riêng, mỗi hàm làm việc một mạch, tránh nhánh lồng sâu. Nhờ vậy bạn tìm bug nhanh hơn và mỗi thay đổi tác động hẹp, ít lôi cả tệp vào cùng lúc cần review.', $$<p>Chia nhỏ hành vi thành hàm riêng, mỗi hàm làm việc một mạch, tránh nhánh lồng sâu.</p>$$, 'published', 5, '2026-04-28 09:00:00+07'::timestamptz, '2026-04-28 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000024'::uuid, 'cong-nghe', 'https://picsum.photos/id/22/640/360', 'Triển khai blog tĩnh, gắn tên miền phụ và thử từng bước công khai', 'trien-khai-blog-tinh-gan-ten-mien-phu-va-thu-tung-buoc-cong-khai', 'Chọn host ổn định, bật HTTPS, rồi kiểm link ảnh và tài nguyên tương đối/tuyệt đối. Ghi lại từng bước khi cấu hình DNS để lần sau không mất thời gian đoán vì cấu hình cũ đã cách vài tháng.', $$<p>Chọn host ổn định, bật HTTPS, rồi kiểm link ảnh và tài nguyên tương đối/tuyệt đối.</p>$$, 'published', 5, '2026-04-27 09:00:00+07'::timestamptz, '2026-04-27 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000025'::uuid, 'cong-nghe', 'https://picsum.photos/id/23/640/360', 'Dùng biến CSS cho màu, khoảng cách và văn bản để đổi theme sạch', 'dung-bien-css-cho-mau-khoang-cach-va-van-ban-de-doi-theme-sach', 'Khai báo tập trung ở :root, tránh số tuyệt đối rải rác trong hàng trăm rule. Khi đổi sáng tối hoặc tăng tương phản, bạn cập ít tệp hơn và bớt sợ sót màu cũ còn sót ở góc khuất giao diện hoặc trạng thái.', $$<p>Khai báo tập trung ở :root, tránh số tuyệt đối rải rác trong hàng trăm rule.</p>$$, 'published', 5, '2026-04-26 09:00:00+07'::timestamptz, '2026-04-26 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000026'::uuid, 'hoc-tap', 'https://picsum.photos/id/24/640/360', 'Chọn kích thước ảnh theo cột, nén cân bằng dung lượng và sắc nét', 'chon-kich-thuoc-anh-theo-cot-nen-can-bang-dung-luong-va-sac-net', 'Xuất nhiều tỷ lệ nếu cần, gắn loading lazy, khai báo rõ ràng width và height. Giảm layout shift, trang nặng tải nhanh hơn, đồng thời tránh tình trạng file ảnh quá lớn so với khung thực tế trên màn hẹp.', $$<p>Xuất nhiều tỷ lệ nếu cần, gắn loading lazy, khai báo rõ ràng width và height.</p>$$, 'published', 5, '2026-04-25 09:00:00+07'::timestamptz, '2026-04-25 09:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000027'::uuid, 'chia-se', 'https://picsum.photos/id/25/640/360', 'Gắn label đúng control, tập nắm tab và focus cho người dùng cảm biến', 'gan-label-dung-control-tap-nam-tab-va-focus-cho-nguoi-dung-cam-bien', 'Kiểm tra phím Escape cho overlay, tương phản màu chữ và nền, kích thước vùng bấm đủ lớn. Các cải tiến này giúp cả màn cảm ứng lẫn bàn phím, mang lại trải nghiệm ổn mà ít tốn thêm tài nguyên cạnh mạng.', $$<p>Kiểm tra phím Escape cho overlay, tương phản màu chữ và nền, kích thước vùng bấm đủ lớn.</p>$$, 'published', 5, '2026-04-24 10:00:00+07'::timestamptz, '2026-04-24 10:00:00+07'::timestamptz),
    ('20000000-0000-4000-8000-000000000028'::uuid, 'cong-nghe', 'https://picsum.photos/id/26/640/360', 'Gọi tài nguyên chính sớm, lề route phụ, trì hoãn mảnh không cần', 'goi-tai-nguyen-chinh-som-le-route-phu-tri-hoan-manh-khong-can', 'Ưu tiên phần màn hình trên, giảm chặn render, tách tệp lớn thành phần tải sau. Đo lại từng bước; đôi khi cắt một tệp ít dùng giúp Cumulative Layout ổn hơn cả hàng chục micro-tối ưu nhỏ lẻ khó nhận.', $$<p>Ưu tiên phần màn hình trên, giảm chặn render, tách tệp lớn thành phần tải sau.</p>$$, 'published', 5, '2026-04-23 10:00:00+07'::timestamptz, '2026-04-23 10:00:00+07'::timestamptz)
  ) AS t(id, category_slug, cover_url, title, slug, excerpt, body_html, status, read_minutes, published_at, updated_at)
)
INSERT INTO posts (
  id,
  author_id,
  category_id,
  cover_asset_id,
  title,
  slug,
  excerpt,
  body_html,
  body_json,
  status,
  read_minutes,
  seo_title,
  meta_description,
  published_at,
  created_at,
  updated_at
)
SELECT
  raw_posts.id,
  '00000000-0000-4000-8000-000000000001',
  categories.id,
  media_assets.id,
  raw_posts.title,
  raw_posts.slug,
  raw_posts.excerpt,
  raw_posts.body_html,
  jsonb_build_object('source', 'blog-ui-seed', 'blocks', jsonb_build_array()),
  raw_posts.status::post_status,
  raw_posts.read_minutes,
  raw_posts.title || ' - Blog UI',
  raw_posts.excerpt,
  raw_posts.published_at,
  raw_posts.updated_at,
  raw_posts.updated_at
FROM raw_posts
JOIN categories ON categories.slug = raw_posts.category_slug
JOIN media_assets ON media_assets.url = raw_posts.cover_url
ON CONFLICT (slug) DO UPDATE
SET author_id = EXCLUDED.author_id,
    category_id = EXCLUDED.category_id,
    cover_asset_id = EXCLUDED.cover_asset_id,
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    body_html = EXCLUDED.body_html,
    body_json = EXCLUDED.body_json,
    status = EXCLUDED.status,
    read_minutes = EXCLUDED.read_minutes,
    seo_title = EXCLUDED.seo_title,
    meta_description = EXCLUDED.meta_description,
    published_at = EXCLUDED.published_at,
    updated_at = EXCLUDED.updated_at,
    deleted_at = NULL;

WITH post_tag_pairs(post_slug, tag_slug) AS (
  VALUES
    ('gioi-thieu-ve-du-an-blog', 'front-end-mobile-apps'),
    ('gioi-thieu-ve-du-an-blog', 'ui-ux-design'),
    ('cau-truc-thu-muc-goi-y', 'front-end-mobile-apps'),
    ('tips-viet-ma-sach', 'front-end-mobile-apps'),
    ('deploy-blog-tinh-len-trang-thu-nghiem', 'back-end-devops'),
    ('mau-sac-va-bien-css', 'ui-ux-design'),
    ('toi-uu-anh-tren-trang-tinh', 'front-end-mobile-apps'),
    ('cai-dat-moi-truong-phat-trien', 'front-end-mobile-apps'),
    ('lam-quen-voi-module-trong-js', 'front-end-mobile-apps'),
    ('typescript-cho-du-an-nho-bat-dau-tu-cau-hinh-toi-thieu', 'front-end-mobile-apps'),
    ('nhanh-git-ro-commit-nho-mo-ta-dong-du-cho-ngay-hom-sau', 'front-end-mobile-apps'),
    ('goi-api-thu-xu-ly-loi-4xx-5xx-va-tai-lai-co-kiem-soat', 'back-end-devops'),
    ('mot-file-dockerfile-volume-cho-ma-nguon-cung-lenh-chay-dev', 'back-end-devops'),
    ('bo-cong-cu-kiem-thu-tieu-chi-thiet-bi-va-tinh-huong-lap-thuong-gap', 'tester-testing'),
    ('dung-khung-trang-tinh-sau-do-tich-hop-router-hoac-form-tung-buoc', 'front-end-mobile-apps'),
    ('gom-css-theo-tang-dat-ten-thu-muc-goi-nho-muc-dich-su-dung', 'front-end-mobile-apps'),
    ('viet-ten-dai-mot-chut-van-on-neu-giup-doc-dung-boi-canh-sua-loi', 'front-end-mobile-apps'),
    ('trien-khai-blog-tinh-gan-ten-mien-phu-va-thu-tung-buoc-cong-khai', 'back-end-devops'),
    ('dung-bien-css-cho-mau-khoang-cach-va-van-ban-de-doi-theme-sach', 'ui-ux-design'),
    ('chon-kich-thuoc-anh-theo-cot-nen-can-bang-dung-luong-va-sac-net', 'front-end-mobile-apps'),
    ('gan-label-dung-control-tap-nam-tab-va-focus-cho-nguoi-dung-cam-bien', 'ui-ux-design'),
    ('goi-tai-nguyen-chinh-som-le-route-phu-tri-hoan-manh-khong-can', 'front-end-mobile-apps')
)
INSERT INTO post_tags (post_id, tag_id)
SELECT posts.id, tags.id
FROM post_tag_pairs
JOIN posts ON posts.slug = post_tag_pairs.post_slug
JOIN tags ON tags.slug = post_tag_pairs.tag_slug
ON CONFLICT (post_id, tag_id) DO NOTHING;

WITH related_pairs(post_slug, related_slug, sort_order) AS (
  VALUES
    ('gioi-thieu-ve-du-an-blog', 'cau-truc-thu-muc-goi-y', 10),
    ('gioi-thieu-ve-du-an-blog', 'tips-viet-ma-sach', 20),
    ('gioi-thieu-ve-du-an-blog', 'deploy-blog-tinh-len-trang-thu-nghiem', 30)
)
INSERT INTO post_relations (post_id, related_post_id, sort_order)
SELECT source_posts.id, related_posts.id, related_pairs.sort_order
FROM related_pairs
JOIN posts AS source_posts ON source_posts.slug = related_pairs.post_slug
JOIN posts AS related_posts ON related_posts.slug = related_pairs.related_slug
ON CONFLICT (post_id, related_post_id) DO UPDATE
SET sort_order = EXCLUDED.sort_order;

COMMIT;
