# SMOSP Acceptance Criteria (AC) & Non-Acceptance Criteria (NAC)
> Covers FT-01 through FT-59 | All roles: Student, CM, Admin, Guest

---

# SMOSP — Acceptance Criteria (AC) & Non-Acceptance Criteria (NAC)

## Tổng hợp toàn bộ AC/NAC theo FT

## FT-01: Student Self-Registration

AC-01-01: Given a new email address not yet registered in the system, when the Student submits the registration form with a valid email and password, then the system creates a new account in inactive state and sends an activation email to that address. *(Sinh viên điền email và mật khẩu hợp lệ vào form đăng ký. Nếu email chưa có trong hệ thống, hệ thống tạo tài khoản ở trạng thái chờ kích hoạt và gửi email xác nhận đến địa chỉ đó.)*

AC-01-02: Given a Student has received an activation email, when the Student clicks a valid and unexpired activation link, then the account is set to active state and the Student is redirected to the login page. *(Sinh viên nhấn vào link trong email xác nhận. Nếu link còn hiệu lực, tài khoản được kích hoạt và sinh viên được chuyển đến trang đăng nhập.)*

AC-01-03: Given an email address already registered in the system, when the Student submits the registration form with that email, then the system displays an error message and does not create a new account. *(Sinh viên cố đăng ký bằng email đã có trong hệ thống — hệ thống báo lỗi và không tạo thêm tài khoản.)*

AC-01-04: Given the Student submits the registration form, when the password does not meet the strength requirements, then the system displays a specific error message and does not create the account. *(Sinh viên nhập mật khẩu không đủ mạnh — hệ thống chỉ rõ lỗi và giữ nguyên form, không tạo tài khoản.)*

NAC-01-01: The system must not activate an account immediately upon registration without email verification. *(Tài khoản không được phép hoạt động ngay sau khi đăng ký — bắt buộc phải qua bước xác minh email trước.)*

NAC-01-02: The system must not store passwords in plaintext under any circumstance. *(Mật khẩu phải được mã hóa trước khi lưu — không được lưu dưới dạng văn bản thô trong bất kỳ trường hợp nào.)*

NAC-01-03: The system must not reveal whether a specific email address exists in the system through error messages — error responses must be generic to prevent email enumeration attacks. *(Thông báo lỗi khi đăng ký không được tiết lộ email nào đã có trong hệ thống — nội dung phải đủ chung chung để kẻ tấn công không thể dò danh sách email hợp lệ.)*

NAC-01-04: Activation links must not remain valid indefinitely — they must expire after a configurable time period. *(Link kích hoạt phải có thời hạn — không được tồn tại vĩnh viễn. Thời gian hết hạn do Admin cấu hình.)*

## FT-02: Google OAuth Registration and Login

AC-02-01: Given the system has a valid Google OAuth client ID and secret configured, when the Student clicks "Login with Google" and completes Google authentication, then the system checks whether the Google email exists in the system. *(Sinh viên nhấn **"**Đăng nhập bằng Google**"** và hoàn tất xác thực phía Google. Hệ thống kiểm tra xem email Google đó đã tồn tại trong hệ thống chưa.)*

AC-02-02: Given the Student authenticates via Google with an email not yet in the system, when authentication completes successfully, then the system automatically creates a new active account and logs the Student in without requiring a separate registration step. *(Sinh viên đăng nhập Google lần đầu với email chưa có trong hệ thống — hệ thống tự động tạo tài khoản và đăng nhập luôn, không yêu cầu đăng ký thêm bước nào.)*

AC-02-03: Given the Student authenticates via Google with an email already in the system, when authentication completes successfully, then the system logs the Student in directly and redirects to the home page. *(Sinh viên đăng nhập Google với email đã có trong hệ thống — hệ thống đăng nhập trực tiếp và chuyển đến trang chủ.)*

AC-02-04: Given the Student cancels or fails Google authentication, when control returns to the system, then the system returns to the login page and displays an appropriate message without creating any account. *(Sinh viên hủy hoặc xác thực Google thất bại — hệ thống quay về trang đăng nhập, hiển thị thông báo phù hợp và không tạo tài khoản nào.)*

NAC-02-01: The system must not require a Google OAuth user to set a password during or after registration. *(Tài khoản tạo qua Google không được bắt buộc sinh viên đặt thêm mật khẩu hệ thống.)*

NAC-02-02: The system must not store the Student's Google access token or refresh token in plaintext. *(Token Google không được lưu dưới dạng văn bản thô trong bất kỳ trường hợp nào.)*

NAC-02-03: The system must not allow Google OAuth flow to create accounts with roles other than Student. *(Luồng đăng ký qua Google chỉ được tạo tài khoản với role Student — không được tạo Content Manager hay Admin qua con đường này.)*

## FT-03: System Account Login

AC-03-01: Given a registered and active Student account, when the Student submits a correct email and password combination, then the system issues a session token and redirects the Student to the student interface. *(Student nhập đúng email và mật khẩu của tài khoản đang active — hệ thống cấp token phiên và chuyển đến giao diện Student.)*

AC-03-02: Given a registered and active Content Manager or Admin account, when the user submits a correct username and password combination, then the system issues a session token and redirects the user to the interface corresponding to their role. *(Content Manager hoặc Admin nhập đúng username và mật khẩu của tài khoản đang active — hệ thống cấp token phiên và chuyển đến giao diện tương ứng với vai trò.)*

AC-03-03: Given any registered account, when the user submits an incorrect credential combination, then the system displays a generic error message without specifying which field is wrong. *(Người dùng nhập sai thông tin đăng nhập — hệ thống hiển thị thông báo lỗi chung, không chỉ rõ trường nào sai.)*

AC-03-04: Given a Student account that has not completed email verification, when the Student attempts to log in with correct credentials, then the system blocks login and informs the Student that the account has not been activated. This AC does not apply to Content Manager or Admin accounts — those accounts are created active by Admin and never enter inactive state. *(Tài khoản Student chưa xác minh email — hệ thống chặn đăng nhập và thông báo tài khoản chưa được kích hoạt. AC này không áp dụng cho Content Manager hay Admin — các tài khoản đó được Admin tạo sẵn ở trạng thái active.)*

AC-03-05: Given a deactivated account, when the user attempts to log in, then the system blocks login and displays an appropriate message. *(Tài khoản bị Admin vô hiệu hóa — hệ thống chặn đăng nhập và hiển thị thông báo phù hợp.)*

AC-03-06: Given an account has failed login 5 consecutive times, when the user attempts to log in again, then the system temporarily locks the account and displays a message informing the user that the account is locked for 30 minutes. *(Tài khoản đăng nhập sai 5 lần liên tiếp — hệ thống khóa tạm thời và hiển thị thông báo tài khoản bị khóa trong 30 phút.)*

AC-03-07: Given an account has been locked for 30 minutes, when the lockout period expires, then the system automatically unlocks the account and allows login attempts again without Admin intervention. *(Tài khoản đã bị khóa đủ 30 phút — hệ thống tự động mở khóa mà không cần Admin can thiệp.)*

NAC-03-01: The system must not reveal which field — identifier or password — is incorrect when login fails. *(Khi đăng nhập thất bại, hệ thống không được tiết lộ trường nào sai — định danh hay mật khẩu.)*

NAC-03-02: The system must not grant access to any protected resource before a valid session token is issued. *(Không có tài nguyên nào được phép truy cập trước khi hệ thống cấp token phiên hợp lệ.)*

NAC-03-03: The system must not allow concurrent login attempts to bypass account lockout mechanisms. *(Hệ thống không được để các request đăng nhập đồng thời vượt qua cơ chế khóa tài khoản.)*

NAC-03-04: The system must not apply email verification requirements to Content Manager or Admin accounts — these accounts are active immediately upon creation by Admin. *(Hệ thống không được áp dụng yêu cầu xác minh email cho tài khoản Content Manager hay Admin — các tài khoản này active ngay khi Admin tạo.)*

NAC-03-05: The system must not allow Content Manager or Admin to log in using email as identifier — username is the only accepted identifier for these roles. *(Hệ thống không được cho phép Content Manager hay Admin đăng nhập bằng email — username là định danh duy nhất được chấp nhận cho các role này.)*

## FT-04: Password Reset

AC-04-01: Given a registered Student email address, when the Student submits a password reset request, then the system sends a reset link to that email within a reasonable time and displays a confirmation message on screen. *(Student nhập email đã đăng ký và yêu cầu đặt lại mật khẩu — hệ thống gửi link reset đến email đó trong thời gian hợp lý và hiển thị thông báo xác nhận trên màn hình.)*

AC-04-02: Given a valid and unexpired reset link, when the Student clicks the link and submits a new password meeting strength requirements, then the system updates the password and invalidates the reset link immediately. *(Student click link reset còn hiệu lực và nhập mật khẩu mới đủ mạnh — hệ thống cập nhật mật khẩu và vô hiệu hóa link đó ngay lập tức.)*

AC-04-03: Given an expired or already-used reset link, when the Student clicks the link, then the system displays an error message and prompts the Student to request a new reset link. *(Student click link reset đã hết hạn hoặc đã dùng — hệ thống báo lỗi và hướng dẫn yêu cầu link mới.)*

AC-04-04: Given an email not registered in the system, when a user submits a password reset request with that email, then the system displays the same confirmation message as a successful request without sending any email. *(Người dùng nhập email không có trong hệ thống để reset mật khẩu — hệ thống hiển thị thông báo xác nhận như bình thường nhưng không gửi email, tránh lộ thông tin tài khoản.)*

NAC-04-01: The system must not allow a reset link to be used more than once. *(Link reset chỉ được dùng một lần — sau khi đã sử dụng phải vô hiệu hóa ngay lập tức.)*

NAC-04-02: The system must not reveal whether an email exists in the system through the password reset response. *(Phản hồi của chức năng reset mật khẩu không được tiết lộ email nào có trong hệ thống — tránh email enumeration attack.)*

NAC-04-03: The system must not allow the new password to be the same as the current password. *(Mật khẩu mới không được trùng với mật khẩu hiện tại.)*

NAC-04-04: All existing sessions must be invalidated immediately after a successful password reset. *(Toàn bộ phiên đăng nhập hiện có phải bị hủy ngay sau khi đặt lại mật khẩu thành công.)*

NAC-04-04b: The system must not offer the email-based self-service reset flow to Content Manager or Admin accounts — Staff accounts have no required email field and use Admin-mediated reset instead (BR-43). *(Hệ thống không được cung cấp luồng reset tự phục vụ qua email cho tài khoản Content Manager hay Admin — Staff không có email field bắt buộc và dùng cơ chế Admin reset thay thế, theo BR-43.)*

## FT-05: Browse Academic Structure

AC-05-01: Given the catalog has at least one published Major, when a Guest navigates to the catalog page, then the system displays the full three-level academic structure without requiring login. *(Khách truy cập trang danh mục mà không cần đăng nhập — hệ thống hiển thị toàn bộ cấu trúc học thuật 3 cấp.)*

AC-05-02: Given the catalog is displayed, when a Guest expands a Major, then the system shows all Specializations under that Major; when a Guest expands a Specialization, then the system shows all Narrow Specializations under it. *(Khách nhấn mở rộng một Major thì thấy các Specialization bên dưới; nhấn mở rộng Specialization thì thấy các Narrow Specialization — không cần tải lại trang.)*

AC-05-03: Given the catalog is displayed, when a Guest collapses an expanded node, then the system hides its children and returns to the previous collapsed state. *(Khách thu gọn một node đang mở — hệ thống ẩn các mục con và trả về trạng thái ban đầu.)*

NAC-05-01: The system must not require login to access the catalog browsing page. *(Trang duyệt danh mục không được yêu cầu đăng nhập.)*

NAC-05-02: The system must not display unpublished or hidden Narrow Specializations to Guest or Student. *(Các Narrow Specialization chưa được publish không được hiển thị với Guest hay Student.)*

## FT-06: View Narrow Specialization Detail

AC-06-01: Given a published Narrow Specialization, when a Guest clicks on it from the catalog, then the system displays the detail page including description, course list organized by term, and Trending Weight. *(Khách nhấn vào một Narrow Specialization đã được publish — hệ thống hiển thị trang chi tiết gồm mô tả, danh sách môn học theo kỳ và Trending Weight.)*

AC-06-02: Given the Narrow Specialization detail page is displayed, when a Guest views the course list, then each course entry shows at minimum the course code, course name, and credit count. *(Trong trang chi tiết, mỗi môn học hiển thị tối thiểu mã môn, tên môn và số tín chỉ.)*

AC-06-03: Given a Guest is viewing a Narrow Specialization detail page, when the Guest clicks a link to another Narrow Specialization, then the system navigates to that detail page without requiring login. *(Khách đang xem chi tiết một Narrow Specialization và nhấn liên kết sang Narrow Specialization khác — hệ thống điều hướng bình thường mà không yêu cầu đăng nhập.)*

NAC-06-01: The system must not display detail pages for unpublished Narrow Specializations — accessing such a URL must return an appropriate error. *(Trang chi tiết của Narrow Specialization chưa publish không được truy cập được — truy cập trực tiếp qua URL phải trả về lỗi phù hợp.)*

NAC-06-02: The system must not require login to view Narrow Specialization detail pages. *(Trang chi tiết Narrow Specialization không được yêu cầu đăng nhập.)*

## FT-07: Search and Filter Specialization Catalog

AC-07-01: Given the catalog page is displayed, when a Guest types a keyword into the search box, then the system displays matching results in real time without requiring a form submission. *(Khách gõ từ khóa vào ô tìm kiếm — hệ thống hiển thị kết quả khớp ngay lập tức mà không cần nhấn submit.)*

AC-07-02: Given search results are displayed, when a Guest selects a Major or Specialization filter, then the system narrows the results to only show Narrow Specializations within the selected scope. *(Khách chọn bộ lọc theo Major hoặc Specialization — hệ thống thu hẹp kết quả chỉ hiển thị các Narrow Specialization thuộc phạm vi đã chọn.)*

AC-07-03: Given a keyword that matches no entry in the catalog, when a Guest searches, then the system displays an empty state message indicating no results were found. *(Khách tìm kiếm từ khóa không khớp bất kỳ mục nào — hệ thống hiển thị thông báo không có kết quả.)*

AC-07-04: Given search results are displayed, when a Guest clicks a result, then the system navigates directly to the Narrow Specialization detail page. *(Khách nhấn vào một kết quả tìm kiếm — hệ thống điều hướng thẳng đến trang chi tiết Narrow Specialization tương ứng.)*

NAC-07-01: The system must not require login to use the search and filter functionality. *(Chức năng tìm kiếm và lọc không được yêu cầu đăng nhập.)*

NAC-07-02: The system must not return unpublished Narrow Specializations in search results. *(Kết quả tìm kiếm không được bao gồm các Narrow Specialization chưa được publish.)*

NAC-07-03: Search results must not expose any internal system identifiers or database keys to the Guest. *(Kết quả tìm kiếm không được lộ bất kỳ định danh nội bộ hay khóa database nào ra giao diện.)*

## FT-08: Student Roadmap Update Notification

AC-08-01: Given a Student has at least one Personal Roadmap cloned from a Standard Roadmap, when Content Manager updates the Standard Roadmap of that Narrow Specialization, then the system automatically sends a notification to the Student indicating which Narrow Specialization was updated and what type of change was made. *(Sinh viên đã clone ít nhất 1 Personal Roadmap — khi Content Manager cập nhật Standard Roadmap tương ứng, hệ thống tự động gửi thông báo cho sinh viên, chỉ rõ Narrow Specialization nào thay đổi và loại thay đổi là gì.)*

AC-08-02: Given a Student has multiple Personal Roadmaps cloned from different Narrow Specializations, when Content Manager updates the Standard Roadmap of one of those Narrow Specializations, then the system sends a notification only for the affected Narrow Specialization. *(Sinh viên có nhiều Personal Roadmap từ các Narrow Specialization khác nhau — khi một Standard Roadmap bị cập nhật, hệ thống chỉ gửi thông báo cho Narrow Specialization bị ảnh hưởng, không gửi đại trà.)*

AC-08-03: Given a Student receives a roadmap update notification, when the Student clicks the notification, then the system navigates to the affected Personal Roadmap and highlights the changed sections. *(Sinh viên nhấn vào thông báo — hệ thống điều hướng đến Personal Roadmap bị ảnh hưởng và làm nổi bật các phần thay đổi.)*

NAC-08-01: The system must not automatically update a Student's Personal Roadmap when the Standard Roadmap changes — the Student must decide whether to apply the changes manually. *(Hệ thống không được tự động cập nhật Personal Roadmap của Student khi Standard Roadmap thay đổi.)*

NAC-08-02: The system must not send roadmap update notifications to Students who have not cloned a Personal Roadmap from the affected Narrow Specialization. *(Hệ thống không được gửi thông báo cập nhật roadmap đến Student chưa clone Personal Roadmap từ Narrow Specialization bị ảnh hưởng.)*

AC-08-04: Given a Narrow Specialization is unpublished by a Content Manager, when the system identifies Students with Personal Roadmaps cloned from that NS, then the system sends each affected Student a notification stating the NS is no longer active and their Personal Roadmap is unaffected. *(Khi một NS bị unpublish, hệ thống gửi thông báo đến từng Student có Personal Roadmap clone từ NS đó, nêu rõ NS không còn active và Personal Roadmap của họ không bị ảnh hưởng — theo BR-25.)*

NAC-08-03: The system must not delete or modify a Student's Personal Roadmap when the source Narrow Specialization is unpublished. *(Hệ thống không được xóa hay chỉnh sửa Personal Roadmap của Student khi Narrow Specialization nguồn bị unpublish.)*

## FT-09: Student Content Error Reporting

AC-09-01: Given a Student is viewing any content page in the system, when the Student clicks the error report button and submits a report with a description, then the system records the report and sends it to Content Manager as a notification. *(Sinh viên đang xem một trang nội dung bất kỳ, nhấn nút báo cáo lỗi và gửi mô tả — hệ thống ghi nhận báo cáo và chuyển đến Content Manager dưới dạng thông báo.)*

AC-09-02: Given a Student submits an error report, when the report is successfully sent, then the system displays a confirmation message to the Student. *(Sinh viên gửi báo cáo lỗi thành công — hệ thống hiển thị thông báo xác nhận đã nhận được báo cáo.)*

AC-09-03: Given a Content Manager receives an error report notification, when the Content Manager clicks the notification, then the system navigates directly to the reported content page. *(Content Manager nhận được thông báo báo cáo lỗi và nhấn vào — hệ thống điều hướng thẳng đến trang nội dung được báo cáo.)*

NAC-09-01: The system must not allow Guest to submit error reports — only authenticated Students can report content errors. *(Chỉ Student đã đăng nhập mới được gửi báo cáo lỗi — Guest không được phép thực hiện thao tác này.)*

NAC-09-02: The system must not expose the identity of the reporting Student to Content Manager without the Student's consent. *(Hệ thống không được tiết lộ danh tính Student gửi báo cáo cho Content Manager nếu Student không đồng ý.)*

NAC-09-03: The system must not allow a Student to submit an empty error report — a description is required. *(Hệ thống không được cho phép gửi báo cáo lỗi trống — mô tả là bắt buộc.)*

## FT-10: Content Manager Operational Alerts

AC-10-01: Given the academic semester schedule has been configured by Admin, when a new semester is approaching based on the configured schedule, then the system sends a reminder notification to Content Manager to review and refresh curriculum data. *(Admin đã cấu hình lịch học kỳ — khi học kỳ mới sắp bắt đầu, hệ thống gửi thông báo nhắc nhở Content Manager xem xét và làm mới dữ liệu curriculum.)*

AC-10-02: Given a crawl cycle has completed and new Trending Weight changes are pending approval, when the AI pipeline finishes processing, then the system sends a notification to Content Manager indicating that new Trending Weight proposals are ready for review. *(Một batch crawl hoàn thành và AI pipeline xử lý xong — hệ thống gửi thông báo đến Content Manager rằng có đề xuất Trending Weight mới chờ xem xét.)*

AC-10-03: Given Content Manager receives an operational alert, when the Content Manager clicks the notification, then the system navigates directly to the relevant action page. *(Content Manager nhận thông báo vận hành và nhấn vào — hệ thống điều hướng thẳng đến trang hành động tương ứng.)*

NAC-10-01: The system must not send operational alerts to Student or Admin — these notifications are exclusively for Content Manager. *(Thông báo vận hành chỉ được gửi đến Content Manager — không được gửi đến Student hay Admin.)*

NAC-10-02: The system must not send duplicate alerts for the same event within the same notification cycle. *(Hệ thống không được gửi thông báo trùng lặp cho cùng một sự kiện trong cùng một chu kỳ thông báo.)*

## FT-11: Admin System Anomaly Alerts

AC-11-01: Given the system monitoring is configured, when an AI model error occurs during processing, then the system automatically sends an alert to Admin including the error type, timestamp, and affected component. *(Khi xảy ra lỗi AI model trong quá trình xử lý, hệ thống tự động gửi cảnh báo đến Admin gồm loại lỗi, thời điểm và component bị ảnh hưởng.)*

AC-11-02: Given the system monitoring is configured, when a crawl failure occurs, then the system automatically sends an alert to Admin including the crawler name, failure reason, and timestamp. *(Khi xảy ra crawl failure, hệ thống tự động gửi cảnh báo đến Admin gồm tên crawler, lý do thất bại và thời điểm xảy ra.)*

AC-11-02b: Given the VietnamWorks API call fails 3 times consecutively (due to endpoint change, authentication, rate limiting, or response schema change), when the 3rd consecutive failure is recorded, then the system sends a standard alert to Admin (BR-38, BV-40a). *(Khi việc gọi API VietnamWorks thất bại 3 lần liên tiếp — do thay đổi endpoint, authentication, rate limiting, hay response schema — hệ thống gửi cảnh báo thông thường đến Admin ở lần thất bại thứ 3, theo BR-38/BV-40a.)*

AC-11-02c: Given the VietnamWorks API call has failed consecutively for 7 days, when the 7-day threshold is reached, then the system sends an urgent alert to Admin and automatically disables the adapter; Admin must manually re-enable it after confirming the integration issue is resolved (BR-38, BV-40b). *(Khi việc gọi API VietnamWorks thất bại liên tiếp trong 7 ngày, hệ thống gửi cảnh báo khẩn cấp đến Admin và tự động disable adapter; Admin phải re-enable thủ công sau khi xác nhận đã sửa lỗi tích hợp — theo BR-38.)*

AC-11-03: Given the system monitoring is configured, when abnormal account activity is detected, then the system automatically sends an alert to Admin describing the suspicious activity and the affected account. *(Khi phát hiện hoạt động tài khoản bất thường, hệ thống tự động gửi cảnh báo đến Admin mô tả hoạt động đáng ngờ và tài khoản bị ảnh hưởng.)*

AC-11-04: Given Admin receives a system anomaly alert, when the Admin clicks the notification, then the system navigates directly to the relevant system management page. *(Admin nhận cảnh báo hệ thống và nhấn vào — hệ thống điều hướng thẳng đến trang quản lý liên quan.)*

NAC-11-01: The system must not send system anomaly alerts to Student or Content Manager — these alerts are exclusively for Admin. *(Cảnh báo hệ thống chỉ được gửi đến Admin — không được gửi đến Student hay Content Manager.)*

NAC-11-02: The system must not suppress anomaly alerts even if the same type of error occurs repeatedly — each occurrence must be logged and reported. *(Hệ thống không được bỏ qua cảnh báo dù cùng loại lỗi xảy ra nhiều lần liên tiếp — mỗi lần xảy ra phải được ghi log và báo cáo.)*

## FT-14: Change Password

AC-12-01: Given a user is logged in with a system account, when the user submits the current password and a new password meeting strength requirements, then the system updates the password and invalidates all other active sessions. *(Người dùng đang đăng nhập bằng tài khoản hệ thống, nhập đúng mật khẩu hiện tại và mật khẩu mới đủ mạnh — hệ thống cập nhật mật khẩu và hủy toàn bộ session khác đang hoạt động.)*

AC-12-02: Given a user submits a password change request, when the current password entered is incorrect, then the system displays an error message and does not update the password. *(Người dùng nhập sai mật khẩu hiện tại — hệ thống báo lỗi và không thay đổi mật khẩu.)*

AC-12-03: Given a user submits a password change request, when the new password does not meet strength requirements, then the system displays a specific error message indicating which requirements are not met. *(Người dùng nhập mật khẩu mới không đủ mạnh — hệ thống chỉ rõ yêu cầu nào chưa được đáp ứng.)*

NAC-12-01: The system must not allow a user to set a new password that is the same as the current password. *(Mật khẩu mới không được trùng với mật khẩu hiện tại.)*

NAC-12-02: The system must not allow Google OAuth-only accounts to access the change password feature. *(Tài khoản đăng nhập thuần túy qua Google OAuth không được truy cập chức năng đổi mật khẩu.)*

NAC-12-03: The system must not store the new password in plaintext under any circumstance. *(Mật khẩu mới phải được mã hóa trước khi lưu — không được lưu dưới dạng văn bản thô.)*

## FT-15: Update Account Preferences

AC-13-01: Given a user is logged in, when the user updates their display name and saves, then the system reflects the new display name immediately across all interfaces without requiring re-login. *(Người dùng đang đăng nhập cập nhật tên hiển thị và lưu — hệ thống phản ánh tên mới ngay lập tức trên toàn bộ giao diện mà không cần đăng nhập lại.)*

AC-13-02: Given a user is logged in, when the user updates notification preferences and saves, then the system applies the new preferences immediately and subsequent notifications follow the updated settings. *(Người dùng cập nhật tùy chọn nhận thông báo và lưu — hệ thống áp dụng ngay lập tức, các thông báo tiếp theo tuân theo cài đặt mới.)*

AC-13-03: Given a user saves account preferences, when the save is successful, then the system displays a confirmation message. *(Người dùng lưu tùy chọn tài khoản thành công — hệ thống hiển thị thông báo xác nhận.)*

NAC-13-01: The system must not allow a user to set an empty display name. *(Tên hiển thị không được để trống.)*

NAC-13-02: The system must not apply preference changes before the user explicitly saves them. *(Thay đổi tùy chọn không được tự động lưu — phải chờ người dùng nhấn lưu rõ ràng.)*

NAC-13-03: The system must not expose preference settings of one user to another user under any circumstance. *(Tùy chọn tài khoản của người dùng này không được hiển thị cho người dùng khác trong bất kỳ trường hợp nào.)*

## FT-16: Personal Information Management

AC-14-01: Given a Student is logged in, when the Student updates their full name, current Major, current Specialization, and academic term (the 4 required fields) then saves, then the system persists the changes and reflects them immediately in the profile used by the recommendation engine. *(Sinh viên đang đăng nhập cập nhật họ tên, Major đang học, Specialization thuộc Major đó, và kỳ học hiện tại — 4 trường bắt buộc — rồi lưu, hệ thống lưu thay đổi và phản ánh ngay vào hồ sơ dùng cho engine gợi ý.)*

AC-14-01b: Given a Student is updating personal information, when the Student leaves the student ID field empty, then the system accepts the submission since student ID is an optional field not used by any system function. *(Sinh viên để trống mã sinh viên — hệ thống vẫn chấp nhận vì đây là field tùy chọn, không có chức năng nào trong hệ thống sử dụng giá trị này.)*

AC-14-02: Given a Student views their profile page, when the page loads, then the system displays the most recently saved values for all personal information fields. *(Sinh viên vào trang hồ sơ — hệ thống hiển thị các giá trị mới nhất đã lưu cho tất cả các trường thông tin cá nhân.)*

AC-14-03: Given a Student submits personal information, when any of the 4 required fields (full name, Major, Specialization, academic term) is left empty, then the system displays a specific error message for each empty field and does not save. *(Sinh viên gửi thông tin cá nhân với một trong 4 trường bắt buộc để trống — hệ thống chỉ rõ trường nào còn thiếu và không lưu.)*

AC-14-04: Given a Student selects a Major, when the Major selection is made, then the system displays the list of Specializations belonging to that Major for the Student to choose from. *(Sinh viên chọn Major — hệ thống hiển thị danh sách Specialization thuộc Major đó để sinh viên chọn.)*

AC-14-05: Given a Student has previously selected a Specialization, when the Student changes their declared Major, then the system clears the previously selected Specialization and requires the Student to select a new one within the new Major. *(Sinh viên đã chọn Specialization trước đó — khi sinh viên đổi Major đã khai báo, hệ thống xóa Specialization đã chọn và yêu cầu chọn lại trong phạm vi Major mới.)*

NAC-14-01: The system must not allow a Student to select a Major that does not exist in the system catalog. *(Sinh viên không được chọn Major không tồn tại trong danh mục hệ thống.)*

NAC-14-02: The system must not allow personal information of one Student to be visible or editable by another Student. *(Thông tin cá nhân của Student này không được hiển thị hay chỉnh sửa bởi Student khác.)*

NAC-14-03: The system must not cross-validate a Student's declared Major or Specialization against transcript data or any external FPT record (FAP or equivalent) — Major and Specialization declaration is accepted at face value per BR-23. *(Hệ thống không được cross-check Major hoặc Specialization khai báo với bảng điểm hay bất kỳ hệ thống FAP nào — Major và Specialization được chấp nhận theo khai báo tự nguyện của Student theo BR-23.)*

NAC-14-04: The system must not allow a Student to save a Specialization that does not belong to the currently selected Major. *(Hệ thống không được cho phép lưu một Specialization không thuộc Major đang được chọn.)*

## FT-17: Transcript File Submission

AC-15-01: Given a Student is logged in and a column mapping preset has been configured by Admin, when the Student uploads an Excel file matching the FPT transcript format, then the system validates the file format and confirms the upload was successful. *(Sinh viên đang đăng nhập và Admin đã cấu hình preset — khi sinh viên tải lên file Excel đúng định dạng FPT, hệ thống xác minh định dạng hợp lệ và xác nhận upload thành công.)*

AC-15-02: Given a Student uploads a file, when the file format is not Excel or does not match the expected FPT transcript structure, then the system rejects the file and displays a specific error message explaining the reason. *(Sinh viên tải lên file không phải Excel hoặc không đúng cấu trúc bảng điểm FPT — hệ thống từ chối file và hiển thị thông báo lỗi cụ thể.)*

AC-15-03: Given a Student uploads a new transcript file, when the upload is successful, then the system replaces the previously uploaded file and triggers the parsing process automatically. *(Sinh viên tải lên file bảng điểm mới — hệ thống thay thế file cũ và tự động kích hoạt quá trình parse.)*

NAC-15-01: The system must not accept file types other than Excel for transcript submission. *(Hệ thống không được chấp nhận bất kỳ định dạng file nào khác ngoài Excel cho việc nộp bảng điểm.)*

NAC-15-02: The system must not allow Guest or unauthenticated users to upload transcript files. *(Guest hoặc người dùng chưa đăng nhập không được phép tải lên file bảng điểm.)*

NAC-15-03: The system must not store uploaded transcript files in a publicly accessible location. *(File bảng điểm đã tải lên không được lưu ở vị trí có thể truy cập công khai.)*

## FT-18: Transcript Parsing

AC-16-01: Given a transcript file has been successfully uploaded and a column mapping preset is configured, when the system parses the file, then the system extracts every course score and saves the full course list to the Student's academic profile, while calculating cumulative GPA only from courses where counts_toward_gpa = true in the curriculum. *(File bảng điểm đã được upload thành công và preset đã được cấu hình — hệ thống parse file, lưu toàn bộ điểm từng môn vào hồ sơ học thuật, nhưng chỉ tính GPA tích lũy từ các môn có flag counts_toward_gpa = true trong curriculum — theo BR-31.)*

AC-16-01b: Given the system has parsed the full course list, when determining which courses count toward the completed-courses list used for tag map matching, then the system includes only courses with a score ≥ 5.0, regardless of whether that course counts toward GPA. *(Khi xác định danh sách môn đã hoàn thành dùng cho tag map matching, hệ thống chỉ tính các môn có điểm ≥ 5.0 — bất kể môn đó có tính vào GPA hay không, theo BR-22. Ví dụ: môn OJT đạt điểm vẫn được tính vào completed courses dù không tính vào GPA.)*

AC-16-02: Given the system completes parsing successfully, when the results are saved, then the system notifies the Student that parsing was successful and the academic profile has been updated. *(Hệ thống parse thành công và lưu kết quả — hệ thống thông báo cho Student rằng hồ sơ học thuật đã được cập nhật.)*

AC-16-03: Given the system attempts to parse a transcript file, when the file content does not match the column mapping preset, then the system notifies the Student of the specific parse error and retains the previous academic profile data. *(Hệ thống cố parse file nhưng nội dung không khớp với preset — hệ thống thông báo lỗi cụ thể cho Student và giữ nguyên dữ liệu hồ sơ học thuật trước đó.)*

NAC-16-01: The system must not overwrite the existing academic profile with partial parse results — either the full parse succeeds or the existing data is retained. *(Hệ thống không được ghi đè hồ sơ học thuật hiện có bằng kết quả parse không đầy đủ.)*

NAC-16-02: The system must not expose raw file content or internal parse logs to the Student — only the final result or error message should be shown. *(Hệ thống không được hiển thị nội dung file thô hay log parse nội bộ cho Student.)*

## FT-19: Skill and Interest Declaration

AC-17-01: Given a Student has declared their Major and Specialization in personal information, when the Student opens the skill and interest declaration page, then the system displays only skills and interests relevant to that Specialization as filtered by the tag map. *(Sinh viên đã khai báo Major và Specialization — khi mở trang khai báo kỹ năng và sở thích, hệ thống chỉ hiển thị danh sách skill và interest được lọc theo Specialization đó qua tag map.)*

AC-17-02: Given the filtered skill and interest list is displayed, when the Student selects skills and interests and saves, then the system persists the selections and uses them as input for the Compatibility Score calculation. *(Danh sách đã được lọc hiển thị — khi Student chọn skill và interest rồi lưu, hệ thống lưu các lựa chọn và dùng làm đầu vào cho engine tính Compatibility Score.)*

AC-17-03: Given a Student has previously declared skills and interests, when the Student returns to the declaration page, then the system displays the previously saved selections pre-checked. *(Student đã khai báo kỹ năng và sở thích trước đó — khi quay lại trang khai báo, hệ thống hiển thị các lựa chọn đã lưu ở trạng thái đã chọn.)*

NAC-17-01: The system must not display skills or interests that are not mapped to the Student's current Specialization. *(Hệ thống không được hiển thị skill hay interest không được ánh xạ với Specialization hiện tại của Student.)*

NAC-17-02: The system must not allow a Student to declare skills or interests that do not exist in the system-managed list. *(Student không được khai báo skill hay interest không tồn tại trong danh sách do Content Manager quản lý.)*

## FT-20: Skill Suggestion from Transcript Courses

AC-51-01: Given a Student's transcript has been parsed successfully (FT-18), when the Student opens the skill and interest declaration page (FT-19), then the system displays a list of suggested skills derived from the Student's completed courses, matched against the tag map. *(Transcript của Student đã parse thành công — khi mở trang khai báo skill/interest, hệ thống hiển thị danh sách skill được gợi ý từ môn đã hoàn thành, đối chiếu qua tag map.)*

AC-51-02: Given a Student has not yet uploaded a transcript, when the Student opens the skill and interest declaration page, then the system displays the declaration page without any course-based suggestions, without blocking manual declaration. *(Student chưa upload transcript — trang khai báo vẫn hiển thị bình thường, không có gợi ý từ môn học, không chặn việc khai báo thủ công.)*

AC-51-03: Given multiple completed courses map to the same skill in the tag map, when generating suggestions, then the system includes that skill only once in the suggestion list (deduplicated). *(Khi nhiều môn đã hoàn thành cùng map đến một skill trong tag map, hệ thống chỉ đưa skill đó vào danh sách gợi ý một lần duy nhất, không lặp lại.)*

NAC-51-01: The system must not automatically add suggested skills to a Student's declared skill list without explicit Student confirmation. *(Hệ thống không được tự động thêm skill được gợi ý vào danh sách đã khai báo của Student mà không có xác nhận rõ ràng.)*

NAC-51-02: The system must not suggest skills that are not mapped to the Student's current Specialization in the tag map. *(Hệ thống không được gợi ý skill không được ánh xạ với Specialization hiện tại của Student trong tag map.)*

## FT-21: Compatibility Score Calculation

AC-18-01: Given a Student has completed their profile including transcript, skills, and interests, when the Student triggers the recommendation or updates their profile, then the system calculates a Compatibility Score for each Narrow Specialization within the Student's Specialization. *(Student đã hoàn thành hồ sơ — khi Student kích hoạt gợi ý hoặc cập nhật hồ sơ, hệ thống tính Compatibility Score cho từng Narrow Specialization trong Specialization của Student.)*

AC-18-02: Given the Compatibility Score is being calculated, when all inputs are available, then the score combines academic performance, skill and interest match via tag map, and approved Trending Weight from recruitment data. *(Khi tính Compatibility Score với đầy đủ dữ liệu đầu vào, điểm phải kết hợp 3 chiều: kết quả học thuật, độ khớp kỹ năng/sở thích qua tag map, và Trending Weight đã được phê duyệt.)*

AC-18-03: Given a Student updates any part of their profile, when the update is saved, then the system recalculates the Compatibility Score automatically to reflect the latest profile data. *(Student cập nhật bất kỳ phần nào trong hồ sơ và lưu — hệ thống tự động tính lại Compatibility Score để phản ánh dữ liệu mới nhất.)*

NAC-18-01: The system must not use unapproved Trending Weight values in the Compatibility Score calculation. *(Hệ thống không được dùng Trending Weight chưa được Content Manager phê duyệt vào tính toán Compatibility Score.)*

NAC-18-02: The system must not calculate Compatibility Scores for Narrow Specializations outside the Student's declared Specialization. *(Hệ thống không được tính Compatibility Score cho các Narrow Specialization ngoài Specialization của Student.)*

NAC-18-03: The system must not expose the internal scoring formula or individual weight values to the Student — only the final score and breakdown by dimension should be shown. *(Hệ thống không được lộ công thức tính điểm nội bộ hay giá trị trọng số riêng lẻ cho Student.)*

## FT-22: Ranked Recommendation Display

AC-19-01: Given Compatibility Scores have been calculated for all Narrow Specializations in the Student's Specialization, when the Student views the recommendation page, then the system displays the Narrow Specializations ranked from highest to lowest Compatibility Score. *(Compatibility Score đã được tính cho tất cả Narrow Specialization trong Specialization của Student — khi Student xem trang gợi ý, hệ thống hiển thị danh sách xếp hạng từ cao đến thấp.)*

AC-19-02: Given the ranked list is displayed, when the Student views each entry, then the system shows a score breakdown explaining the contribution of each dimension. *(Danh sách xếp hạng được hiển thị — mỗi mục hiển thị breakdown điểm theo 3 chiều: học thuật, kỹ năng/sở thích và thị trường.)*

AC-19-03: Given the ranked list is displayed, when the Student clicks the shortcut on the top-ranked result, then the system navigates directly to the Standard Academic Roadmap of that Narrow Specialization. *(Danh sách xếp hạng được hiển thị — khi Student nhấn shortcut trên kết quả top 1, hệ thống điều hướng thẳng đến Standard Academic Roadmap của Narrow Specialization đó.)*

AC-19-04: Given a Student has selected between 2 and 4 Narrow Specializations from the ranked list, when the Student requests a comparison, then the system displays a side-by-side table showing the Compatibility Score, three-dimension breakdown, and skill gap list for each selected Narrow Specialization. *(Student chọn từ 2 đến 4 Narrow Specialization trong danh sách xếp hạng và yêu cầu so sánh — hệ thống hiển thị bảng song song gồm Compatibility Score, breakdown 3 chiều, và danh sách skill gap cho mỗi NS đã chọn.)*

AC-19-05: Given a side-by-side comparison is displayed, when a selected Narrow Specialization already has a generated AI Reason from a prior view, then the system displays that Reason in the comparison; otherwise the system shows a button to generate it on demand for that specific Narrow Specialization only. *(Bảng so sánh được hiển thị — nếu một NS đã có AI Reason được sinh trước đó, hệ thống hiển thị kèm; nếu chưa có, hệ thống hiển thị nút để sinh theo yêu cầu riêng cho NS đó.)*

NAC-19-01: The system must not display recommendation results before Compatibility Scores have been fully calculated. *(Hệ thống không được hiển thị kết quả gợi ý trước khi Compatibility Score được tính xong toàn bộ.)*

NAC-19-02: The system must not show Narrow Specializations outside the Student's declared Specialization in the recommendation results. *(Kết quả gợi ý không được bao gồm Narrow Specialization ngoài Specialization của Student.)*

NAC-19-03: The system must not automatically generate AI Reason for all selected Narrow Specializations at once when opening the comparison view — generation must remain on-demand per item. *(Hệ thống không được tự động sinh AI Reason đồng loạt cho toàn bộ NS đã chọn khi mở bảng so sánh — việc sinh phải theo yêu cầu riêng từng mục.)*

NAC-19-04: The system must not allow more than 4 Narrow Specializations to be selected for side-by-side comparison at once. *(Hệ thống không được cho phép chọn quá 4 Narrow Specialization để so sánh side-by-side cùng lúc.)*

## FT-23: Skill Gap Analysis

AC-20-01: Given Compatibility Scores have been calculated, when the Student views the recommendation results, then the system displays alongside each recommended Narrow Specialization a list of skills the Student currently lacks compared to the tag map requirements. *(Compatibility Score đã được tính — khi Student xem kết quả gợi ý, hệ thống hiển thị kèm theo từng Narrow Specialization danh sách kỹ năng Student còn thiếu.)*

AC-20-02: Given the skill gap list is displayed, when the Student views a missing skill, then the system provides a development suggestion such as a related course or learning resource. *(Danh sách kỹ năng còn thiếu được hiển thị — khi Student xem một kỹ năng còn thiếu, hệ thống gợi ý phát triển như môn học liên quan hoặc tài nguyên học tập.)*

NAC-20-01: The system must not display skill gap analysis results before Compatibility Score calculation is complete. *(Hệ thống không được hiển thị kết quả skill gap analysis trước khi tính xong Compatibility Score.)*

NAC-20-02: The system must not show skills outside the tag map configuration for the relevant Narrow Specialization as part of the gap analysis. *(Hệ thống không được hiển thị kỹ năng nằm ngoài cấu hình tag map của Narrow Specialization liên quan trong kết quả gap analysis.)*

AC-20-03: Given Compatibility Scores have been calculated and the Student's current skill profile already covers all skills required by the tag map for a recommended Narrow Specialization, when the Student views the skill gap result for that Narrow Specialization, then the system displays a message indicating no skill gap was found instead of an empty list. *(Compatibility Score đã tính và Student không thiếu kỹ năng nào so với yêu cầu của Narrow Specialization — hệ thống hiển thị thông báo **"**không có kỹ năng còn thiếu**"** thay vì để trống danh sách.)*

## FT-24: Compatibility Score Reason Generation

AC-50-01: Given Compatibility Scores have been calculated and ranked for a Student's Specialization (FT-21, FT-22), when ranking completes, then the system automatically calls Gemini AI to generate a Reason explanation for the top-ranked Narrow Specialization, using Student profile data and score breakdown as input. *(Compatibility Score đã được tính và xếp hạng — khi ranking hoàn tất, hệ thống tự động gọi Gemini AI sinh Reason cho NS xếp hạng cao nhất, dựa trên profile và score breakdown của Student.)*

AC-50-02: Given a Student views the detail of a specific Narrow Specialization in the ranked list, when the detail page is requested, then the system calls Gemini AI to generate a Reason explanation for that specific Narrow Specialization on demand. *(Student xem chi tiết một Narrow Specialization trong danh sách xếp hạng — hệ thống gọi Gemini AI sinh Reason theo yêu cầu cho NS đó.)*

AC-50-03: Given a Reason has been successfully generated, when the result page renders, then the system displays the Reason text alongside the Compatibility Score breakdown. *(Reason đã được sinh thành công — trang kết quả hiển thị Reason kèm breakdown của Compatibility Score.)*

NAC-50-01: The system must not block display of Compatibility Score or ranking if Gemini AI fails or times out while generating the Reason text — a placeholder must be shown instead (BR-48). *(Hệ thống không được chặn hiển thị Compatibility Score hay ranking nếu Gemini AI lỗi hoặc timeout khi sinh Reason — phải hiển thị placeholder thay thế, theo BR-48.)*

NAC-50-02: The system must not expose raw AI prompts or internal API request/response details to the Student — only the final generated Reason text should be shown. *(Hệ thống không được lộ prompt thô hay chi tiết request/response API nội bộ cho Student — chỉ hiển thị văn bản Reason cuối cùng.)*

## FT-27: Standard Academic Roadmap View

AC-21-01: Given a Narrow Specialization has a fully configured curriculum, when a Student accesses the Standard Academic Roadmap for that Narrow Specialization, then the system composes the parent Specialization's common courses (Term 1–4, from FT-45) with the Narrow Specialization's specific courses (Term 5–9, from FT-46) into a single continuous roadmap, displaying all courses organized by term including course code, course name, credit count, and prerequisite relationships. *(Narrow Specialization đã có curriculum đầy đủ — khi Student truy cập Standard Academic Roadmap, hệ thống ghép môn chung của Specialization cha (kỳ 1–4, từ FT-45) với môn chuyên sâu của NS (kỳ 5–9, từ FT-46) thành một roadmap liên tục, hiển thị toàn bộ môn học theo kỳ gồm mã môn, tên môn, số tín chỉ và quan hệ tiên quyết.)*

AC-21-02: Given the Standard Academic Roadmap is displayed, when a Student clicks on a course, then the system navigates to the course detail page. *(Standard Academic Roadmap đang hiển thị — khi Student nhấn vào một môn học, hệ thống điều hướng đến trang chi tiết môn học đó.)*

AC-21-03: Given a Student accesses the roadmap from the recommendation results, when the page loads, then the system highlights the top-recommended Narrow Specialization's roadmap by default. *(Student truy cập roadmap từ kết quả gợi ý — hệ thống mặc định hiển thị roadmap của Narrow Specialization được gợi ý cao nhất.)*

NAC-21-01: The system must not allow Students to modify the Standard Academic Roadmap — it is read-only. *(Student không được phép chỉnh sửa Standard Academic Roadmap — đây là bản chỉ đọc.)*

NAC-21-02: The system must not display Standard Academic Roadmaps for unpublished Narrow Specializations. *(Hệ thống không được hiển thị Standard Academic Roadmap của Narrow Specialization chưa được publish.)*

## FT-28: Personal Roadmap Cloning

AC-22-01: Given a Student is logged in and has fewer than 5 Personal Roadmaps, when the Student clones a Standard Academic Roadmap, then the system creates a new Personal Roadmap as an independent copy and adds it to the Student's roadmap list. *(Student đang đăng nhập và có ít hơn 5 Personal Roadmap — khi Student clone một Standard Academic Roadmap, hệ thống tạo một bản sao độc lập và thêm vào danh sách roadmap của Student.)*

AC-22-02: Given a Student already has 5 Personal Roadmaps, when the Student attempts to clone another roadmap, then the system blocks the action and displays a message indicating the maximum limit has been reached. *(Student đã có đủ 5 Personal Roadmap — khi cố clone thêm, hệ thống chặn thao tác và hiển thị thông báo đã đạt giới hạn tối đa.)*

AC-22-03: Given a Student successfully clones a roadmap, when the clone is complete, then the system assigns a default name to the new Personal Roadmap and navigates the Student to the roadmap list page. *(Student clone roadmap thành công — hệ thống gán tên mặc định cho Personal Roadmap mới và điều hướng Student đến trang danh sách roadmap.)*

AC-22-04: Given a Student clones a Standard Academic Roadmap, when the clone is saved, then the system records the source Narrow Specialization as a reference on the Personal Roadmap, used to notify the Student if that NS is later unpublished (BR-25). *(Khi Student clone một Standard Roadmap và lưu thành công, hệ thống ghi nhận Narrow Specialization gốc như một reference trên Personal Roadmap — dùng để notify sau này nếu NS bị unpublish, theo BR-25.)*

NAC-22-01: The system must not allow a Student to clone more than 5 Personal Roadmaps under any circumstance. *(Hệ thống không được cho phép Student clone quá 5 Personal Roadmap trong bất kỳ trường hợp nào.)*

NAC-22-02: Changes made to a Personal Roadmap must not affect the Standard Academic Roadmap it was cloned from. *(Thay đổi trên Personal Roadmap không được ảnh hưởng đến Standard Academic Roadmap gốc.)*

NAC-22-03: The system must not allow Guest or unauthenticated users to clone roadmaps. *(Guest hoặc người dùng chưa đăng nhập không được phép clone roadmap.)*

## FT-29: Personal Roadmap List Management

AC-23-01: Given a Student has at least one Personal Roadmap, when the Student opens the roadmap list page, then the system displays all cloned Personal Roadmaps with their names and last updated timestamps. *(Student có ít nhất 1 Personal Roadmap — khi mở trang danh sách roadmap, hệ thống hiển thị toàn bộ Personal Roadmap đã clone kèm tên và thời gian cập nhật gần nhất.)*

AC-23-02: Given a Personal Roadmap is displayed, when the Student marks a course status as Completed, In Progress, or Planned, then the system saves the status change immediately. *(Personal Roadmap đang hiển thị — khi Student đánh dấu trạng thái một môn, hệ thống lưu thay đổi ngay lập tức.)*

AC-23-03: Given a Student wants to rename a Personal Roadmap, when the Student edits the name and saves, then the system updates the name immediately across all references. *(Student muốn đổi tên Personal Roadmap, chỉnh sửa tên và lưu — hệ thống cập nhật tên ngay lập tức.)*

AC-23-04: Given a Student deletes a Personal Roadmap, when the deletion is confirmed, then the system permanently removes the roadmap and updates the roadmap count. *(Student xóa một Personal Roadmap và xác nhận — hệ thống xóa vĩnh viễn roadmap đó và cập nhật số lượng roadmap còn lại.)*

NAC-23-01: The system must not allow deletion of a Personal Roadmap without explicit confirmation from the Student. *(Hệ thống không được xóa Personal Roadmap mà không có xác nhận rõ ràng từ Student.)*

NAC-23-02: Deleting a Personal Roadmap must not affect the Standard Academic Roadmap it was cloned from. *(Xóa Personal Roadmap không được ảnh hưởng đến Standard Academic Roadmap gốc.)*

NAC-23-03: The system must not allow one Student to view or modify another Student's Personal Roadmap. *(Hệ thống không được cho phép Student này xem hay chỉnh sửa Personal Roadmap của Student khác.)*

NAC-23-04: The system must not automatically rename a Personal Roadmap when the source Narrow Specialization's name changes — the Student-assigned name remains independent (BR-26). *(Hệ thống không được tự động đổi tên Personal Roadmap khi tên Narrow Specialization gốc thay đổi — tên do Student tự đặt giữ độc lập, theo BR-26.)*

AC-23-05: Given a course is removed from the Standard Roadmap by Content Manager, when a Student's Personal Roadmap contains that course, then the system flags the course as "removed from standard curriculum" rather than deleting it from the Personal Roadmap, preserving the Student's progress notes (BR-30). *(Khi CM xóa một môn khỏi Standard Roadmap, nếu Personal Roadmap của Student đang chứa môn đó, hệ thống đánh dấu môn là **"**đã loại khỏi chương trình chuẩn**"** thay vì xóa khỏi Personal Roadmap, giữ nguyên ghi chú/tiến độ của Student — theo BR-30.)*

## FT-30: Course Detail and Learning Resource View

AC-24-01: Given a course exists in the system and belongs to an active Narrow Specialization, when a Student clicks on a course from the roadmap, then the system displays the course detail page including course description and learning outcomes. *(Môn học tồn tại và thuộc Narrow Specialization đang active — khi Student nhấn vào môn học từ roadmap, hệ thống hiển thị trang chi tiết gồm mô tả môn học và kết quả học tập đầu ra.)*

AC-24-02: Given a course has learning resources attached by Content Manager, when a Student views the course detail page, then the system displays the list of learning resources with name and type. *(Môn học có tài nguyên học tập được Content Manager đính kèm — khi Student xem trang chi tiết, hệ thống hiển thị danh sách tài nguyên kèm tên và loại.)*

AC-24-03: Given learning resources are displayed, when a Student clicks a resource link, then the system opens the resource in a new tab without navigating away from the course detail page. *(Tài nguyên học tập đang hiển thị — khi Student nhấn vào link tài nguyên, hệ thống mở tài nguyên trong tab mới mà không rời khỏi trang chi tiết môn học.)*

AC-24-04: Given a course has no learning resources attached, when a Student views the course detail page, then the system displays the course information normally with an empty resource section. *(Môn học chưa có tài nguyên nào được đính kèm — khi Student xem trang chi tiết, hệ thống vẫn hiển thị thông tin môn học bình thường với phần tài nguyên trống.)*

NAC-24-01: The system must not display course detail pages for courses belonging to unpublished Narrow Specializations. *(Hệ thống không được hiển thị trang chi tiết môn học thuộc Narrow Specialization chưa được publish.)*

NAC-24-02: The system must not open resource links in the same tab — all external resources must open in a new tab. *(Hệ thống không được mở link tài nguyên trong cùng tab — tất cả tài nguyên bên ngoài phải mở trong tab mới.)*

## FT-31: Holland RIASEC Assessment

AC-25-01: Given the question bank and scoring weights have been configured by Content Manager, when a Student in the transfer consideration flow triggers the Holland assessment, then the system presents questions from the question bank one by one and collects the Student's answers. *(Question bank và scoring weight đã được Content Manager cấu hình — khi Student trong luồng xem xét chuyển ngành kích hoạt bài kiểm tra Holland, hệ thống trình bày câu hỏi và thu thập câu trả lời.)*

AC-25-02: Given a Student completes all questions, when the Student submits the assessment, then the system calculates scores across all 6 RIASEC dimensions based on the configured scoring weights. *(Student hoàn thành toàn bộ câu hỏi và submit — hệ thống tính điểm theo 6 chiều RIASEC dựa trên scoring weight đã cấu hình.)*

AC-25-03: Given a Student is in the middle of the assessment, when the Student navigates away and returns, then the system restores the previously answered questions so the Student can continue from where they left off. *(Student đang làm bài và thoát ra rồi quay lại — hệ thống khôi phục các câu đã trả lời để Student tiếp tục từ chỗ đã dừng.)*

NAC-25-01: The system must not allow a Student to submit the assessment with unanswered questions. *(Hệ thống không được cho phép Student submit bài kiểm tra khi còn câu chưa trả lời.)*

NAC-25-02: The system must not trigger the Holland assessment outside of the transfer consideration flow. *(Hệ thống không được kích hoạt bài kiểm tra Holland ngoài luồng xem xét chuyển ngành.)*

NAC-25-03: The system must not expose scoring weights or the internal calculation formula to the Student during or after the assessment. *(Hệ thống không được lộ trọng số chấm điểm hay công thức tính điểm nội bộ cho Student.)*

## FT-32: Holland Assessment Result Display

AC-26-01: Given a Student has completed the Holland assessment, when the results page loads, then the system displays the Student's RIASEC profile showing scores across all 6 dimensions with explanation of each dimension's meaning. *(Student đã hoàn thành bài kiểm tra Holland — khi trang kết quả tải, hệ thống hiển thị profile RIASEC của Student gồm điểm 6 chiều kèm giải thích ý nghĩa từng chiều.)*

AC-26-02: Given the RIASEC profile is displayed, when the Student views the results, then the system shows career groups and broad majors that align with the Student's profile. *(Profile RIASEC đang hiển thị — khi Student xem kết quả, hệ thống hiển thị các nhóm nghề nghiệp và ngành học rộng phù hợp với profile đó.)*

AC-26-03: Given a Student has completed the assessment and views results, when the Student navigates away and returns later, then the system displays the previously saved results without requiring the Student to retake the assessment. *(Student đã hoàn thành bài kiểm tra, thoát ra và quay lại sau — hệ thống hiển thị kết quả đã lưu mà không yêu cầu làm lại bài.)*

NAC-26-01: The system must not display Holland assessment results before the assessment is fully completed and submitted. *(Hệ thống không được hiển thị kết quả Holland trước khi bài kiểm tra được hoàn thành và submit đầy đủ.)*

NAC-26-02: The system must not present Holland results as definitive career or academic decisions — results must be framed as orientation guidance only. *(Hệ thống không được trình bày kết quả Holland như quyết định nghề nghiệp hay học thuật chính thức — kết quả phải được trình bày rõ ràng là định hướng tham khảo.)*

## FT-33: Configure Holland Specialization Compatibility Weights

AC-91-01: Given a Content Manager is logged in and at least one Specialization exists, when the Content Manager opens the Holland Compatibility Weights configuration page, then the system displays a grid with one row per Specialization and six columns for the RIASEC dimensions (R/I/A/S/E/C), each cell showing the current weight value in the range 0.0–1.0. *(Content Manager mở trang cấu hình — hệ thống hiển thị bảng trọng số với hàng là Specialization, cột là 6 chiều RIASEC, mỗi ô hiển thị trọng số hiện tại trong khoảng 0.0–1.0.)*

AC-91-02: Given a Content Manager updates one or more weight values and saves, when the save is successful, then the system persists the new weights, applies them to all subsequent Holland Spec Score calculations, and records the identity of the Content Manager and the timestamp of the change. *(Content Manager cập nhật trọng số và lưu thành công — hệ thống lưu cấu hình mới, áp dụng cho lần tính Holland Spec Score tiếp theo, và ghi log người thực hiện + thời điểm thay đổi — theo BR-04.)*

NAC-91-01: The system must not save any weight value that is less than 0.0 or greater than 1.0; the offending cell must be highlighted and an error message displayed. *(Hệ thống không được lưu giá trị trọng số ngoài khoảng [0.0, 1.0] — ô lỗi phải được highlight và hiển thị thông báo lỗi.)*

NAC-91-02: The system must warn the Content Manager when all six RIASEC dimension weights for a Specialization are set to 0.0, indicating that this Specialization will always receive a Holland Spec Score of zero regardless of any Student's profile. *(Hệ thống phải cảnh báo Content Manager khi toàn bộ 6 chiều RIASEC của một Specialization đều bằng 0.0 — Spec này sẽ luôn có Holland Score = 0 dù Student có profile gì.)*

## FT-33: View Specialization Ranking by Holland Compatibility

AC-92-01: Given a Student has completed at least one Holland Assessment and Content Manager has configured weights for at least one Specialization, when the Student opens the Specialization ranking page from the Holland result screen, then the system calculates a Holland Spec Score for every published Specialization that has a weight configuration and displays them ranked in descending order. *(Student đã hoàn thành ít nhất 1 bài Holland và CM đã cấu hình trọng số cho ít nhất 1 Spec — khi Student mở trang xếp hạng từ màn hình kết quả Holland, hệ thống tính Holland Spec Score cho toàn bộ Specialization published có cấu hình trọng số và hiển thị theo thứ tự giảm dần.)*

AC-92-02: Given the ranked Specialization list is displayed, when the Student views it, then each entry shows the Specialization name, Holland Spec Score, a bar chart breakdown of the six RIASEC dimensions' contribution, and a visible advisory disclaimer stating results are for orientation guidance only (BR-11). *(Danh sách xếp hạng hiển thị — mỗi mục gồm tên Specialization, điểm Holland Spec Score, bar chart breakdown 6 chiều RIASEC đóng góp, và disclaimer tư vấn rõ ràng theo BR-11.)*

AC-92-03: Given the ranked list is displayed, when the Student clicks on a Specialization, then the system navigates to the Transfer Cost Analysis view with that Specialization pre-filled as the transfer target. *(Student nhấn vào một Specialization trong danh sách — hệ thống điều hướng đến Transfer Cost Analysis với Specialization đó được pre-fill là mục tiêu chuyển ngành.)*

AC-92-04: Given at least one published Specialization does not have a weight configuration, when the system calculates rankings, then that Specialization is excluded from the ranked list without any error message. *(Một Specialization published chưa có cấu hình trọng số — hệ thống loại Spec đó ra khỏi danh sách xếp hạng mà không hiển thị thông báo lỗi.)*

AC-92-05: Given no Specialization has a weight configuration, when the Student opens the ranking page, then the system displays a message stating that assessment data has not yet been configured and the feature will be available once Content Manager completes configuration. *(Chưa có Specialization nào được cấu hình trọng số — hệ thống hiển thị thông báo dữ liệu đánh giá chưa được cấu hình, không hiển thị danh sách trống.)*

NAC-92-01: The system must not display the internal weight values configured by Content Manager to the Student at any point — only the resulting scores and breakdowns are visible. *(Hệ thống không được hiển thị giá trị trọng số nội bộ mà Content Manager đã cấu hình cho Student — chỉ điểm kết quả và breakdown được hiển thị.)*

## FT-34: Transfer Cost Analysis

AC-27-01: Given a Student has entered their current Narrow Specialization and selected a target Narrow Specialization, when the Student triggers transfer cost analysis, then the system displays the list of courses to be retained, courses to be added, and courses to be retaken. *(Student đã nhập Narrow Specialization hiện tại và chọn Narrow Specialization mục tiêu — khi kích hoạt phân tích chi phí chuyển ngành, hệ thống hiển thị danh sách môn được bảo lưu, môn cần học thêm và môn cần học lại.)*

AC-27-02: Given the course analysis is displayed, when the Student views the results, then the system shows an estimated number of additional semesters required to complete the transfer. *(Kết quả phân tích môn học đang hiển thị — hệ thống hiển thị ước tính số kỳ học bổ sung cần thiết để hoàn thành việc chuyển ngành.)*

AC-27-03: Given the academic cost analysis is displayed, when the Student views the financial section, then the system shows the estimated additional tuition cost calculated from the number of additional and retaken credits multiplied by the configured credit price. *(Kết quả phân tích học thuật đang hiển thị — hệ thống hiển thị ước tính học phí bổ sung được tính từ số tín chỉ cần học thêm và học lại nhân với đơn giá tín chỉ đã được Admin cấu hình.)*

NAC-27-01: The system must not perform transfer cost analysis without the Student explicitly entering their current Narrow Specialization in this flow. *(Hệ thống không được thực hiện phân tích chi phí chuyển ngành mà không có Student nhập rõ Narrow Specialization hiện tại trong luồng này.)*

NAC-27-02: The system must not display financial cost estimates if the credit price data has not been configured by Admin. *(Hệ thống không được hiển thị ước tính chi phí tài chính nếu Admin chưa cấu hình đơn giá tín chỉ.)*

NAC-27-03: The system must not present transfer cost analysis as an official academic decision — results must be clearly framed as advisory information only. *(Hệ thống không được trình bày kết quả phân tích chuyển ngành như quyết định học vụ chính thức — kết quả phải được trình bày rõ ràng là thông tin tư vấn tham khảo.)*

## FT-35: Labor Market Signal Display for Transfer

AC-28-01: Given approved Trending Weight data exists for the target Narrow Specialization, when a Student views the transfer analysis, then the system displays the number of current job listings and the reference salary range for the target Narrow Specialization. *(Dữ liệu Trending Weight đã được phê duyệt tồn tại cho Narrow Specialization mục tiêu — khi Student xem phân tích chuyển ngành, hệ thống hiển thị số lượng việc làm hiện có và dải lương tham chiếu cho ngành mục tiêu.)*

AC-28-02: Given both current and target Narrow Specialization data are available, when the Student views the market signals, then the system displays the Trending Weight of the target Narrow Specialization compared to the current one side by side. *(Dữ liệu của cả Narrow Specialization hiện tại và mục tiêu đều có — khi Student xem tín hiệu thị trường, hệ thống hiển thị Trending Weight của ngành mục tiêu so sánh song song với ngành hiện tại.)*

NAC-28-01: The system must not display labor market signals based on unapproved Trending Weight data. *(Hệ thống không được hiển thị tín hiệu thị trường lao động dựa trên Trending Weight chưa được phê duyệt.)*

NAC-28-02: The system must not present labor market data as guaranteed employment outcomes — data must be clearly labeled as reference information from a specific crawl date. *(Hệ thống không được trình bày dữ liệu thị trường lao động như cam kết việc làm — dữ liệu phải được ghi rõ là thông tin tham khảo từ ngày crawl cụ thể.)*

AC-28-03: Given the target Narrow Specialization does not yet have any approved Trending Weight data, when the Student views the transfer analysis, then the system displays a message indicating market signal data is not yet available for that Narrow Specialization, instead of showing blank or zero values. *(Narrow Specialization mục tiêu chưa có Trending Weight nào được approve — hệ thống hiển thị thông báo **"**chưa có dữ liệu thị trường**"** thay vì để trống hoặc hiển thị giá trị 0 gây hiểu nhầm.)*

## FT-36: Transfer Impact Summary Report

AC-29-01: Given both FT-34 and FT-35 have completed successfully, when the Student views the summary report, then the system displays a side-by-side comparison of the current and target Narrow Specialization covering academic cost and market signals in a single view. *(FT-34 và FT-35 đã hoàn thành — khi Student xem báo cáo tổng hợp, hệ thống hiển thị so sánh song song giữa ngành hiện tại và ngành mục tiêu gồm chi phí học thuật và tín hiệu thị trường trong một màn hình duy nhất.)*

AC-29-02: Given the summary report is displayed, when the Student clicks print or save, then the system generates a printable or downloadable version of the report. *(Báo cáo tổng hợp đang hiển thị — khi Student nhấn in hoặc lưu, hệ thống tạo phiên bản có thể in hoặc tải xuống.)*

NAC-29-01: The system must not generate the summary report if either FT-34 or FT-35 has not completed successfully. *(Hệ thống không được tạo báo cáo tổng hợp nếu FT-34 hoặc FT-35 chưa hoàn thành thành công.)*

NAC-29-02: The system must not present the summary report as an official document — it must include a disclaimer that the content is for advisory purposes only. *(Hệ thống không được trình bày báo cáo tổng hợp như tài liệu chính thức — báo cáo phải có disclaimer rõ ràng rằng nội dung chỉ mang tính tư vấn.)*

## FT-37: Skill List Management

AC-30-01: Given a Content Manager is logged in, when the Content Manager creates a new skill with a name and optional alias, then the system saves the skill and makes it available in the skill declaration list for Students. *(Content Manager đang đăng nhập tạo skill mới với tên và alias tùy chọn — hệ thống lưu skill và đưa vào danh sách khai báo cho Student.)*

AC-30-02: Given a skill exists in the system, when the Content Manager updates the skill name or alias, then the system reflects the changes immediately across all references including the tag map and Student declaration pages. *(Skill đã tồn tại — khi Content Manager cập nhật tên hoặc alias, hệ thống phản ánh thay đổi ngay lập tức ở tất cả các nơi tham chiếu.)*

AC-30-03: Given a skill exists in the system, when the Content Manager deletes it, then the system soft-deletes the skill (marks it inactive) rather than physically removing the record — the skill no longer appears in new declaration lists but historical references remain intact. *(Skill tồn tại — khi Content Manager xóa, hệ thống soft-delete (đánh dấu inactive) thay vì xóa vật lý — skill không còn hiển thị trong danh sách khai báo mới, nhưng tham chiếu lịch sử vẫn nguyên vẹn — theo BR-09.)*

NAC-30-01: The system must not physically delete a skill record from the database under any circumstance, regardless of whether it is currently referenced — deletion via the Content Manager interface must always be a soft-delete (BR-09). *(Hệ thống không được xóa vật lý bản ghi skill khỏi database trong bất kỳ trường hợp nào, bất kể có đang được tham chiếu hay không — xóa qua giao diện Content Manager luôn phải là soft-delete, theo BR-09.)*

NAC-30-02: The system must not allow duplicate skill names in the system. *(Hệ thống không được cho phép tồn tại hai skill có tên trùng nhau.)*

## FT-38: Work Interest List Management

AC-31-01: Given a Content Manager is logged in, when the Content Manager creates a new work interest with a name, then the system saves it and makes it available in the interest declaration list for Students. *(Content Manager đang đăng nhập tạo sở thích nghề nghiệp mới với tên — hệ thống lưu và đưa vào danh sách khai báo cho Student.)*

AC-31-02: Given a work interest exists in the system, when the Content Manager updates the interest name, then the system reflects the change immediately across all references. *(Sở thích đã tồn tại — khi Content Manager cập nhật tên, hệ thống phản ánh thay đổi ngay lập tức ở tất cả các nơi tham chiếu.)*

AC-31-03: Given a work interest exists in the system, when the Content Manager deletes it, then the system soft-deletes the interest (marks it inactive) rather than physically removing the record — it no longer appears in new declaration lists but historical references remain intact. *(Sở thích tồn tại — khi Content Manager xóa, hệ thống soft-delete (đánh dấu inactive) thay vì xóa vật lý — không còn hiển thị trong danh sách khai báo mới, nhưng tham chiếu lịch sử vẫn nguyên vẹn — theo BR-09.)*

NAC-31-01: The system must not physically delete a work interest record from the database under any circumstance, regardless of whether it is currently referenced — deletion via the Content Manager interface must always be a soft-delete (BR-09). *(Hệ thống không được xóa vật lý bản ghi sở thích khỏi database trong bất kỳ trường hợp nào, bất kể có đang được tham chiếu hay không — xóa qua giao diện Content Manager luôn phải là soft-delete, theo BR-09.)*

NAC-31-02: The system must not allow duplicate work interest names in the system. *(Hệ thống không được cho phép tồn tại hai sở thích có tên trùng nhau.)*

## FT-39: Tag Map Configuration

AC-32-01: Given a Content Manager selects a Major from the dropdown and selects a Narrow Specialization from the left panel, when the Content Manager adds a skill to that Narrow Specialization, then the system saves the mapping with the specified classification — direct or shared — and the configured weight. *(Content Manager chọn Major từ dropdown và chọn Narrow Specialization từ bảng bên trái — khi thêm một skill vào Narrow Specialization đó, hệ thống lưu ánh xạ với phân loại direct hoặc shared và trọng số đã cấu hình.)*

AC-32-02: Given a tag map entry exists, when the Content Manager changes the classification from direct to shared or vice versa, then the system updates the classification immediately and applies it to the next Compatibility Score calculation. *(Một mục tag map đã tồn tại — khi Content Manager thay đổi phân loại từ direct sang shared hoặc ngược lại, hệ thống cập nhật ngay và áp dụng cho lần tính điểm tiếp theo.)*

AC-32-03: Given a Content Manager removes a skill or interest from a Narrow Specialization's tag map, when the removal is saved, then the system excludes that mapping from subsequent Compatibility Score calculations without affecting previously calculated scores. *(Content Manager xóa một skill hoặc interest khỏi tag map của một Narrow Specialization — hệ thống loại bỏ ánh xạ đó khỏi các lần tính điểm tiếp theo mà không ảnh hưởng đến các điểm đã tính trước đó.)*

NAC-32-01: The system must not apply tag map changes retroactively to previously calculated Compatibility Scores. *(Hệ thống không được áp dụng thay đổi tag map hồi tố lên các Compatibility Score đã tính trước đó.)*

NAC-32-02: The system must not allow a tag map to be saved without at least one skill or interest mapped to a Narrow Specialization. *(Hệ thống không được cho phép lưu tag map của một Narrow Specialization mà không có ít nhất một skill hoặc interest được ánh xạ.)*

## FT-40: Holland Question Bank Management

AC-33-01: Given a Content Manager is logged in, when the Content Manager creates a new question with answer options and assigns it to a RIASEC dimension, then the system saves the question in active state and makes it available for the assessment. *(Content Manager đang đăng nhập tạo câu hỏi mới với các lựa chọn trả lời và phân loại chiều RIASEC — hệ thống lưu câu hỏi ở trạng thái active và đưa vào bài kiểm tra.)*

AC-33-02: Given a question exists in the question bank, when the Content Manager deactivates the question, then the system excludes it from future assessments without deleting it from the system. *(Câu hỏi tồn tại trong question bank — khi Content Manager tắt câu hỏi, hệ thống loại khỏi các bài kiểm tra tiếp theo mà không xóa khỏi hệ thống.)*

AC-33-03: Given a question exists, when the Content Manager edits the question content or answer options, then the system saves the updated version and applies it to future assessments only. *(Câu hỏi đã tồn tại — khi Content Manager chỉnh sửa nội dung câu hỏi hoặc lựa chọn trả lời, hệ thống lưu phiên bản mới và chỉ áp dụng cho các bài kiểm tra tiếp theo.)*

NAC-33-01: The system must not allow deletion of questions — only deactivation is permitted to preserve assessment history integrity. *(Hệ thống không được cho phép xóa câu hỏi — chỉ được phép tắt để bảo toàn tính toàn vẹn của lịch sử bài kiểm tra.)*

NAC-33-02: The system must not allow a question to be saved without being assigned to at least one RIASEC dimension. *(Hệ thống không được cho phép lưu câu hỏi mà không được phân loại vào ít nhất một chiều RIASEC.)*

## FT-41: Assessment Scoring Weight Configuration

AC-34-01: Given a Content Manager is logged in and the question bank has at least one question, when the Content Manager adjusts the scoring weight for an answer option or a RIASEC dimension and saves, then the system applies the new weights to subsequent assessments. *(Content Manager đang đăng nhập và question bank có ít nhất 1 câu hỏi — khi điều chỉnh trọng số chấm điểm và lưu, hệ thống áp dụng trọng số mới cho các bài kiểm tra tiếp theo.)*

AC-34-02: Given scoring weights have been updated, when a Student takes the assessment after the update, then the system uses the new weights to calculate RIASEC scores. *(Trọng số chấm điểm đã được cập nhật — khi Student làm bài kiểm tra sau khi cập nhật, hệ thống dùng trọng số mới để tính điểm RIASEC.)*

NAC-34-01: The system must not retroactively recalculate RIASEC scores for assessments completed before the weight change. *(Hệ thống không được tính lại điểm RIASEC hồi tố cho các bài kiểm tra đã hoàn thành trước khi thay đổi trọng số.)*

NAC-34-02: The system must not allow scoring weights to be set to zero or negative values. *(Hệ thống không được cho phép đặt trọng số chấm điểm bằng 0 hoặc âm.)*

AC-34-03: Given scoring weight changes have been made over time, when a Content Manager opens the scoring weight configuration page, then the system displays the current weights and a history of past changes with timestamps and the Content Manager who made each change. *(Đã có các lần thay đổi trọng số chấm điểm trước đó — khi CM mở trang cấu hình, hệ thống hiển thị trọng số hiện tại và lịch sử các lần thay đổi kèm thời điểm và người thực hiện, đồng bộ với pattern của FT-26.)*

## FT-42: Course Catalog Management

AC-35-01: Given a Content Manager is logged in, when the Content Manager creates a new course with course code, name, credit count, classification, description, and a counts_toward_gpa flag (default: true), then the system saves the course and makes it available for curriculum configuration. *(Content Manager đang đăng nhập tạo môn học mới với mã môn, tên môn, số tín chỉ, phân loại, mô tả, và flag counts_toward_gpa (mặc định: true) — hệ thống lưu môn học và đưa vào danh mục để cấu hình curriculum.)*

AC-35-01b: Given a Content Manager is configuring a course, when the Content Manager sets counts_toward_gpa to false (for example OJT, Giáo dục quốc phòng), then the system excludes that course from cumulative GPA calculation in FT-18 while still including its score in the Student's full transcript record. *(CM đặt counts_toward_gpa = false cho một môn — hệ thống loại trừ môn đó khỏi công thức tính GPA tích lũy ở FT-18, nhưng vẫn lưu điểm đầy đủ trong bảng điểm của Student — theo BR-31.)*

AC-35-02: Given a course exists in the system, when the Content Manager updates course information, then the system reflects the changes immediately in all roadmaps that include that course. *(Môn học đã tồn tại — khi Content Manager cập nhật thông tin, hệ thống phản ánh thay đổi ngay lập tức trong tất cả roadmap có chứa môn học đó.)*

AC-35-03: Given a course exists in the system, when the Content Manager deletes it, then the system soft-deletes the course (marks it inactive) rather than physically removing the record — the course no longer appears as a selectable option in new curriculum configuration (FT-43), regardless of whether it is currently assigned to any Standard Roadmap. *(Môn học tồn tại — khi Content Manager xóa, hệ thống soft-delete (đánh dấu inactive) thay vì xóa vật lý — môn không còn là lựa chọn trong cấu hình curriculum mới (FT-43), bất kể đang được gán vào Standard Roadmap nào hay không — theo BR-09.)*

NAC-35-01: The system must not physically delete a course record from the database under any circumstance — deletion via the Content Manager interface must always be a soft-delete (BR-09). If the course is removed from a Standard Roadmap's term assignment via FT-43 while Personal Roadmaps still reference it, those Personal Roadmaps must only be flagged, never altered or stripped of the record (BR-30). *(Hệ thống không được xóa vật lý bản ghi môn học khỏi database trong bất kỳ trường hợp nào — xóa qua giao diện Content Manager luôn phải là soft-delete, theo BR-09. Nếu môn bị tháo gán khỏi Standard Roadmap qua FT-43 mà Personal Roadmap vẫn tham chiếu, Personal Roadmap đó chỉ được flag, không bị thay đổi hay mất bản ghi — theo BR-30.)*

NAC-35-02: The system must not allow duplicate course codes in the system. *(Hệ thống không được cho phép tồn tại hai môn học có mã môn trùng nhau.)*

## FT-43: Course Prerequisite and Term Order Configuration

AC-36-01: Given courses exist in the system and a Narrow Specialization exists, when the Content Manager assigns courses to terms and defines prerequisite relationships, then the system saves the configuration and uses it to render the roadmap structure. *(Các môn học và Narrow Specialization đã tồn tại — khi Content Manager gán môn học vào kỳ và định nghĩa quan hệ tiên quyết, hệ thống lưu cấu hình và dùng để render cấu trúc roadmap.)*

AC-36-02: Given a prerequisite relationship is being configured, when the Content Manager attempts to create a circular dependency between courses, then the system detects and blocks the configuration with an appropriate error message. *(Content Manager đang cấu hình quan hệ tiên quyết và cố tạo vòng lặp phụ thuộc giữa các môn — hệ thống phát hiện và chặn cấu hình đó kèm thông báo lỗi phù hợp.)*

AC-36-03: Given a term order is configured, when a Student views the Standard Academic Roadmap, then the system displays courses in the correct term order as configured by Content Manager. *(Thứ tự kỳ học đã được cấu hình — khi Student xem Standard Academic Roadmap, hệ thống hiển thị môn học đúng thứ tự kỳ theo cấu hình của Content Manager.)*

NAC-36-01: The system must not allow circular prerequisite relationships between courses under any circumstance. *(Hệ thống không được cho phép tồn tại quan hệ tiên quyết vòng tròn giữa các môn học trong bất kỳ trường hợp nào.)*

NAC-36-02: The system must not allow a course to be assigned to a term that precedes the term of its prerequisite. *(Hệ thống không được cho phép gán môn học vào kỳ đứng trước kỳ của môn tiên quyết của nó.)*

## FT-44: Learning Resource Attachment Management

AC-37-01: Given a course exists in the system, when the Content Manager attaches a learning resource with a URL, name, and resource type, then the system saves the resource and displays it on the course detail page for Students. *(Môn học đã tồn tại — khi Content Manager đính kèm tài nguyên học tập với URL, tên và loại tài nguyên, hệ thống lưu và hiển thị trên trang chi tiết môn học cho Student.)*

AC-37-02: Given a learning resource exists, when the Content Manager reorders the resources, then the system saves the new order and displays resources in the updated order on the course detail page. *(Tài nguyên học tập đã tồn tại — khi Content Manager sắp xếp lại thứ tự, hệ thống lưu thứ tự mới và hiển thị theo thứ tự đã cập nhật.)*

AC-37-03: Given a learning resource exists, when the Content Manager deletes it, then the system removes it from the course detail page immediately. *(Tài nguyên học tập đã tồn tại — khi Content Manager xóa, hệ thống xóa ngay khỏi trang chi tiết môn học.)*

NAC-37-01: The system must not accept malformed URLs as learning resource links. *(Hệ thống không được chấp nhận URL không hợp lệ làm link tài nguyên học tập.)*

NAC-37-02: The system must not allow learning resources to be attached to courses that do not exist in the system. *(Hệ thống không được cho phép đính kèm tài nguyên học tập vào môn học không tồn tại trong hệ thống.)*

## FT-45: Major and Specialization Management

AC-38-01: Given a Content Manager is logged in, when the Content Manager creates a new Major or Specialization with a name and description, then the system saves it and makes it available in the catalog hierarchy. *(Content Manager đang đăng nhập tạo Major hoặc Specialization mới với tên và mô tả — hệ thống lưu và đưa vào cấu trúc phân cấp catalog.)*

AC-38-02: Given a Major or Specialization exists, when the Content Manager hides it, then the system immediately removes it and all its child Narrow Specializations from the Student-facing catalog. *(Major hoặc Specialization đã tồn tại — khi Content Manager ẩn, hệ thống xóa ngay khỏi catalog hiển thị với Student cùng toàn bộ Narrow Specialization con.)*

AC-38-03: Given a Major or Specialization is hidden, when the Content Manager unhides it, then the system restores it and all its previously published child Narrow Specializations to the Student-facing catalog. *(Major hoặc Specialization đang bị ẩn — khi Content Manager hiện lại, hệ thống khôi phục nó và toàn bộ Narrow Specialization con đã được publish trước đó vào catalog.)*

NAC-38-01: The system must not allow deletion of a Major or Specialization that has active child Narrow Specializations. *(Hệ thống không được cho phép xóa Major hoặc Specialization có Narrow Specialization con đang active.)*

NAC-38-02: The system must not allow duplicate Major or Specialization names within the same level of the hierarchy. *(Hệ thống không được cho phép tồn tại tên Major hoặc Specialization trùng nhau trong cùng cấp phân cấp.)*

AC-38-04: Given a Specialization exists, when the Content Manager selects it and assigns courses to Term 1–4, then the system saves the term assignment for that Specialization. *(Specialization đã tồn tại — khi Content Manager chọn nó và gán môn học vào kỳ 1–4, hệ thống lưu cấu hình kỳ cho Specialization đó.)*

AC-38-05: Given Term 1–4 courses and prerequisite relationships have been configured for a Specialization, when the Content Manager saves, then the system persists the configuration for use in rendering the Standard Academic Roadmap (UC-18). *(Môn kỳ 1–4 và quan hệ tiên quyết đã được cấu hình cho một Specialization — khi Content Manager lưu, hệ thống ghi nhận cấu hình để dùng render Standard Academic Roadmap.)*

NAC-38-03: The system must not allow a circular prerequisite dependency among a Specialization's Term 1–4 courses. *(Hệ thống không được cho phép tồn tại vòng lặp phụ thuộc tiên quyết giữa các môn kỳ 1–4 của một Specialization.)*

## FT-46: Narrow Specialization Management

AC-39-01: Given a Major and Specialization parent exist, when the Content Manager creates a new Narrow Specialization with a name, description, and links to the parent, then the system saves it in unpublished state. *(Major và Specialization cha đã tồn tại — khi Content Manager tạo Narrow Specialization mới với tên, mô tả và liên kết với cha, hệ thống lưu ở trạng thái chưa publish.)*

AC-39-02: Given a Narrow Specialization exists in unpublished state, when the Content Manager publishes it, then the system makes it visible in the Student-facing catalog immediately. *(Narrow Specialization đang ở trạng thái chưa publish — khi Content Manager publish, hệ thống hiển thị ngay trong catalog cho Student.)*

AC-39-03: Given a published Narrow Specialization, when the Content Manager unpublishes it, then the system immediately removes it from the Student-facing catalog without deleting any associated data, then queries all Personal Roadmaps referencing that NS (recorded at clone time per FT-28/AC-22-04) and dispatches a notification to each affected Student via the mechanism in FT-08 (BR-25). *(Narrow Specialization đang published — khi Content Manager unpublish, hệ thống xóa ngay khỏi catalog Student mà không xóa dữ liệu liên quan, sau đó query tất cả Personal Roadmap có reference đến NS đó (ghi nhận tại FT-28/AC-22-04) và gửi notification đến từng Student bị ảnh hưởng qua cơ chế FT-08 — theo BR-25.)*

NAC-39-01: The system must not display an unpublished Narrow Specialization to Students or Guests under any circumstance. *(Hệ thống không được hiển thị Narrow Specialization chưa publish cho Student hay Guest trong bất kỳ trường hợp nào.)*

NAC-39-02: The system must not allow a Narrow Specialization to be published without a parent Specialization. *(Hệ thống không được cho phép publish Narrow Specialization mà không có Specialization cha.)*

NAC-39-03: The system must not allow Term 1–4 courses (Specialization common courses) to be configured directly on a Narrow Specialization — those belong to the parent Specialization and are managed via FT-45. *(Hệ thống không được cho phép cấu hình môn kỳ 1–4 (môn chung của Specialization) trực tiếp trên Narrow Specialization — các môn này thuộc về Specialization cha và được quản lý qua FT-45.)*

NAC-39-04: The system must not provide a delete action for Narrow Specialization under any interface — only create, update, publish, and unpublish are available (per FT-46's scope). Unpublish (BR-25) is the sole mechanism for retiring a Narrow Specialization; the record is never physically removed. *(Hệ thống không được cung cấp hành động **"**xóa**"** cho Narrow Specialization dưới bất kỳ giao diện nào — chỉ có tạo, cập nhật, publish, và unpublish (theo phạm vi FT-46). Unpublish (BR-25) là cơ chế duy nhất để rút một NS khỏi sử dụng; record không bao giờ bị xóa vật lý.)*

## FT-47: VietnamWorks Crawler Execution

AC-40-01: Given the VietnamWorks adapter is enabled and crawl schedule is configured, when the scheduled time arrives, then the system automatically triggers the crawler to collect the latest job listings asynchronously. *(Adapter VietnamWorks đã được bật và lịch crawl đã được cấu hình — khi đến giờ đã lên lịch, hệ thống tự động kích hoạt crawler thu thập job listing mới nhất bất đồng bộ.)*

AC-40-02: Given a Content Manager is logged in, when the Content Manager manually triggers the crawler, then the system starts a new crawl batch immediately and confirms the batch has started. *(Content Manager đang đăng nhập và kích hoạt crawler thủ công — hệ thống bắt đầu một batch crawl mới ngay lập tức và xác nhận batch đã bắt đầu.)*

AC-40-03: Given a crawl batch is running or has completed, when the Content Manager checks the crawl status, then the system displays the current status and progress of the batch. *(Một batch crawl đang chạy hoặc đã hoàn thành — khi Content Manager kiểm tra trạng thái, hệ thống hiển thị trạng thái hiện tại và tiến độ của batch.)*

NAC-40-01: The system must not allow two crawl batches to run simultaneously for the same adapter. *(Hệ thống không được cho phép hai batch crawl chạy đồng thời cho cùng một adapter.)*

NAC-40-02: The system must not block other system operations while a crawl batch is running — crawling must be fully asynchronous. *(Hệ thống không được chặn các thao tác hệ thống khác trong khi batch crawl đang chạy — crawling phải hoàn toàn bất đồng bộ.)*

AC-40-04: Given a crawl batch completes and the AI pipeline processes the collected job listings, when the AI API fails or runs out of quota partway through processing a batch, then the system discards the partial results for that batch and notifies Content Manager that the batch must be re-run (BR-41). *(Khi batch crawl hoàn thành và AI pipeline đang xử lý dữ liệu, nếu AI API lỗi hoặc hết quota giữa chừng, hệ thống loại bỏ kết quả partial của batch đó và thông báo Content Manager cần chạy lại batch — theo BR-41.)*

AC-40-05: Given a crawl batch has been fully processed by the AI pipeline, when all proposed Trending Weight values for that batch equal 0, then the system flags the batch as anomalous and alerts both Content Manager and Admin instead of generating a normal approval proposal (BR-39). *(Khi một batch đã được AI pipeline xử lý xong và toàn bộ Trending Weight đề xuất đều bằng 0, hệ thống đánh dấu batch là anomaly và cảnh báo cả Content Manager và Admin, không tạo đề xuất phê duyệt bình thường — theo BR-39.)*

NAC-40-03: The system must not save or use partial AI pipeline processing results from a batch that failed midway due to AI API errors. *(Hệ thống không được lưu hay sử dụng kết quả xử lý partial của AI pipeline từ một batch bị lỗi giữa chừng do AI API gặp sự cố.)*

## FT-48: Crawl Batch and Error Log Review

AC-41-01: Given at least one crawl batch has completed, when the Content Manager opens the crawl log page, then the system displays a list of batches with run time, number of listings collected, and success rate. *(Đã có ít nhất 1 batch crawl hoàn thành — khi Content Manager mở trang crawl log, hệ thống hiển thị danh sách batch với thời gian chạy, số listing thu thập được và tỷ lệ thành công.)*

AC-41-02: Given a crawl batch has parse errors, when the Content Manager filters the error log by error type, then the system displays only the errors matching the selected type. *(Một batch crawl có parse error — khi Content Manager lọc error log theo loại lỗi, hệ thống chỉ hiển thị các lỗi khớp với loại được chọn.)*

AC-41-03: Given the error log is displayed, when the Content Manager clicks on a specific error entry, then the system displays the full error detail including the affected data and the error message. *(Error log đang hiển thị — khi Content Manager nhấn vào một mục lỗi cụ thể, hệ thống hiển thị chi tiết đầy đủ gồm dữ liệu bị ảnh hưởng và thông báo lỗi.)*

AC-41-04: Given a crawl batch log is older than 365 days, when the retention threshold is reached, then the system automatically archives the log to cold storage without permanently deleting it, and the log remains retrievable on request (BR-40). *(Crawl batch log cũ hơn 365 ngày — khi đến ngưỡng retention, hệ thống tự động archive log sang cold storage mà không xóa vĩnh viễn, log vẫn có thể retrieve khi cần — theo BR-40.)*

AC-41-04b: Given Admin is logged in, when Admin opens the crawl batch and error log page, then the system displays the same batch overview and error log available to Content Manager, for the purpose of diagnosing adapter or AI pipeline configuration issues. *(Admin đã đăng nhập — khi Admin mở trang batch overview và error log, hệ thống hiển thị cùng nội dung như Content Manager thấy, phục vụ mục đích chẩn đoán lỗi cấu hình adapter hoặc AI pipeline.)*

NAC-41-01: The system must not allow Content Manager or Admin to delete or modify crawl batch logs — logs are read-only for audit purposes. *(Hệ thống không được cho phép Content Manager hoặc Admin xóa hay chỉnh sửa crawl batch log — log chỉ đọc để phục vụ mục đích audit.)*

NAC-41-02: The system must not expose raw database records or internal system paths in the error log displayed to Content Manager or Admin. *(Hệ thống không được lộ bản ghi database thô hay đường dẫn hệ thống nội bộ trong error log hiển thị cho Content Manager hoặc Admin.)*

## FT-49: Trending Weight Approval

AC-42-01: Given a crawl batch has completed and the AI pipeline has processed the data, when the Content Manager opens the Trending Weight approval page, then the system displays a list of proposed changes showing the current value and the new proposed value for each Narrow Specialization. *(Batch crawl hoàn thành và AI pipeline đã xử lý xong — khi Content Manager mở trang phê duyệt Trending Weight, hệ thống hiển thị danh sách đề xuất thay đổi với giá trị hiện tại và giá trị mới được đề xuất cho từng Narrow Specialization.)*

AC-42-02: Given the proposal list is displayed, when the Content Manager approves a Trending Weight change, then the system applies the new value immediately and uses it in subsequent Compatibility Score calculations. *(Danh sách đề xuất đang hiển thị — khi Content Manager phê duyệt một thay đổi Trending Weight, hệ thống áp dụng giá trị mới ngay lập tức và dùng cho các lần tính Compatibility Score tiếp theo.)*

AC-42-03: Given the proposal list is displayed, when the Content Manager rejects a Trending Weight change, then the system retains the current value and logs the rejection with a timestamp. *(Danh sách đề xuất đang hiển thị — khi Content Manager từ chối một thay đổi Trending Weight, hệ thống giữ nguyên giá trị hiện tại và ghi log từ chối kèm timestamp.)*

AC-42-04: Given a Trending Weight proposal has not been approved or rejected within 7 days of creation, when the 7-day window expires, then the system automatically rejects the proposal, retains the current Trending Weight value, and notifies Admin of the expired proposal (BR-37). *(Đề xuất Trending Weight chưa được phê duyệt hay từ chối trong vòng 7 ngày — khi hết hạn, hệ thống tự động reject đề xuất, giữ nguyên Trending Weight hiện tại, và thông báo cho Admin về đề xuất hết hạn — theo BR-37.)*

NAC-42-01: The system must not apply any Trending Weight change to the recommendation engine without explicit Content Manager approval. *(Hệ thống không được áp dụng bất kỳ thay đổi Trending Weight nào vào engine gợi ý mà không có phê duyệt rõ ràng từ Content Manager.)*

NAC-42-02: The system must not allow Trending Weight values to be set to zero or negative numbers. *(Hệ thống không được cho phép đặt giá trị Trending Weight bằng 0 hoặc âm.)*

## FT-51: User List View and Search

AC-43-01: Given an Admin is logged in, when the Admin opens the user management page, then the system displays the full list of users with name, identifier (email for Student, username for CM/Admin), role, account status, and registration date. *(Admin đang đăng nhập mở trang quản lý người dùng — hệ thống hiển thị toàn bộ danh sách người dùng với tên, định danh, role, trạng thái tài khoản và ngày đăng ký.)*

AC-43-02: Given the user list is displayed, when the Admin searches by name or identifier, then the system filters the list in real time to show only matching users. *(Danh sách người dùng đang hiển thị — khi Admin tìm kiếm theo tên hoặc định danh, hệ thống lọc danh sách real time chỉ hiển thị người dùng khớp.)*

AC-43-03: Given the user list is displayed, when the Admin applies a role or status filter, then the system narrows the list to show only users matching the selected filter. *(Danh sách người dùng đang hiển thị — khi Admin áp dụng bộ lọc theo role hoặc trạng thái, hệ thống thu hẹp danh sách chỉ hiển thị người dùng khớp với bộ lọc đã chọn.)*

NAC-43-01: The system must not expose sensitive user data such as passwords or tokens in the user list view. *(Hệ thống không được lộ dữ liệu nhạy cảm của người dùng như mật khẩu hay token trong màn hình danh sách người dùng.)*

NAC-43-02: The system must not allow non-Admin users to access the user management page. *(Hệ thống không được cho phép người dùng không phải Admin truy cập trang quản lý người dùng.)*

## FT-52: User Account Status Management

AC-44-01: Given an Admin selects an active user account, when the Admin deactivates the account and confirms, then the system invalidates all active sessions of that user within 60 seconds and prevents further login (BR-44). *(Admin chọn tài khoản đang active và deactivate rồi xác nhận — hệ thống hủy toàn bộ session hiện tại của người dùng đó trong vòng 60 giây và ngăn đăng nhập tiếp theo — theo BR-44.)*

AC-44-02: Given an Admin selects a deactivated user account, when the Admin activates the account, then the system restores the account to active state and allows the user to log in again. *(Admin chọn tài khoản đang deactivated và activate — hệ thống khôi phục tài khoản về trạng thái active và cho phép người dùng đăng nhập lại.)*

AC-44-03: Given an Admin performs any account status change, when the action is completed, then the system logs the change with the Admin's identity and timestamp. *(Admin thực hiện bất kỳ thay đổi trạng thái tài khoản nào — khi hoàn thành, hệ thống ghi log thay đổi với danh tính Admin và timestamp.)*

AC-44-04: Given an Admin attempts to deactivate a Content Manager or Admin account, when that account is the last remaining active Admin in the system, then the system blocks the action and displays an error message indicating at least one active Admin must remain. *(Admin cố deactivate tài khoản Admin duy nhất còn active — hệ thống chặn thao tác và hiển thị thông báo phải giữ ít nhất 1 Admin active.)*

AC-44-05: Given an Admin attempts to deactivate their own account, when at least one other Admin account remains active after the action, then the system allows the deactivation; when the Admin is the last active Admin, then the system blocks the action and displays an error message — the same check applied in AC-44-04, applied here to self-targeting. *(Admin cố deactivate tài khoản của chính mình — nếu còn ít nhất 1 Admin khác đang active sau hành động, hệ thống cho phép; nếu Admin đó là Admin active cuối cùng, hệ thống chặn và hiển thị thông báo lỗi — cùng logic check với AC-44-04, áp dụng cho trường hợp tự deactivate.)*

AC-44-06: Given a Staff account exists and the Staff member cannot log in due to a forgotten password, when the Admin issues a new temporary password for that account, then the system updates the account's password, requires the Staff member to change it upon next login (BR-45), and logs the action with Admin identity and timestamp (BR-43). *(Tài khoản Staff tồn tại và Staff không đăng nhập được vì quên password — khi Admin cấp password tạm thời mới cho tài khoản đó, hệ thống cập nhật password, bắt buộc Staff đổi password ở lần đăng nhập tiếp theo (BR-45), và ghi log hành động với danh tính Admin và timestamp — theo BR-43.)*

NAC-44-01: The system must not allow any deactivation action — whether targeting another Admin or the Admin's own account — that would result in zero active Admin accounts remaining. *(Hệ thống không được cho phép bất kỳ thao tác deactivate nào — nhắm vào Admin khác hay vào chính tài khoản của Admin đó — dẫn đến kết quả 0 Admin account đang active.)*

NAC-44-02: The system must not allow account deletion under any circumstance — only activation and deactivation are permitted. *(Hệ thống không được cho phép xóa tài khoản trong bất kỳ trường hợp nào — chỉ cho phép kích hoạt và vô hiệu hóa.)*

NAC-44-03: The system must not deactivate the last remaining active Admin account under any circumstance. *(Hệ thống không được cho phép deactivate tài khoản Admin active cuối cùng trong hệ thống.)*

NAC-44-04: The system must not allow reactivation of a staff account to bypass the forced password change requirement if the account has never completed first login. *(Hệ thống không được cho phép reactivate tài khoản staff mà bỏ qua yêu cầu đổi password lần đầu nếu tài khoản đó chưa hoàn thành first login.)*

NAC-44-05: The system must not display the emergency super-admin account (BR-42) in the regular Admin list managed through this feature, and must not count it toward the active Admin pool tracked by BR-20. *(Hệ thống không được hiển thị super-admin account khẩn cấp — theo BR-42 — trong danh sách Admin thông thường quản lý qua chức năng này, và không được tính account này vào pool active Admin mà BR-20 theo dõi.)*

## FT-53: Staff Account Creation

AC-45-01: Given an Admin is logged in, when the Admin submits a new staff account form with a unique username, full name, role (Content Manager or Admin), and temporary password meeting strength requirements, then the system creates the account in active state and the new user can log in immediately. *(Admin điền form tạo tài khoản mới với username chưa tồn tại, họ tên, role và password tạm thời đủ mạnh — hệ thống tạo tài khoản ở trạng thái active ngay lập tức và người dùng mới có thể đăng nhập ngay.)*

AC-45-02: Given an Admin submits a new staff account form, when the username already exists in the system regardless of role, then the system rejects the creation and displays an error message indicating the username is already taken. *(Admin tạo tài khoản với username đã tồn tại trong hệ thống — hệ thống từ chối và hiển thị thông báo username đã được sử dụng.)*

AC-45-03: Given an Admin submits a new staff account form, when the password does not meet strength requirements, then the system rejects the creation and displays a specific error message indicating which requirements are not met. *(Admin nhập password tạm thời không đủ mạnh — hệ thống từ chối và chỉ rõ yêu cầu nào chưa được đáp ứng.)*

AC-45-04: Given an Admin submits a new staff account form, when the role field is left empty or contains a value other than Content Manager or Admin, then the system rejects the creation and displays an error message. *(Admin để trống role hoặc chọn role không hợp lệ — hệ thống từ chối và hiển thị thông báo lỗi.)*

AC-45-05: Given a staff account has been successfully created, when the new user logs in for the first time using the temporary password, then the system prompts the user to change their password before accessing any feature. *(Người dùng mới đăng nhập lần đầu bằng password tạm thời — hệ thống yêu cầu đổi password trước khi truy cập bất kỳ tính năng nào.)*

NAC-45-01: The system must not allow Staff Account Creation to assign the Student role — this endpoint is exclusively for Content Manager and Admin role creation. *(Hệ thống không được cho phép tạo tài khoản Student qua luồng này — chỉ được tạo Content Manager và Admin.)*

NAC-45-02: The system must not send any email notification during staff account creation — Admin is responsible for communicating credentials to the new user through external channels. *(Hệ thống không được gửi email thông báo khi tạo tài khoản staff — Admin tự thông báo thông tin đăng nhập cho người dùng mới qua kênh ngoài hệ thống.)*

NAC-45-03: The system must not create a staff account without a password — temporary password is mandatory at creation time. *(Hệ thống không được tạo tài khoản staff mà không có password — password tạm thời là bắt buộc tại thời điểm tạo.)*

NAC-45-04: The system must not store the temporary password in plaintext — it must be hashed before storage, consistent with BR-01. *(Password tạm thời phải được hash trước khi lưu — không được lưu dưới dạng plaintext, nhất quán với BR-01.)*

NAC-45-05: The system must not allow a newly created staff account to bypass the forced password change on first login. *(Hệ thống không được cho phép tài khoản staff mới bỏ qua bước bắt buộc đổi password ở lần đăng nhập đầu tiên.)*

## FT-54: Crawl Schedule Configuration

AC-46-01: Given an Admin is logged in, when the Admin configures a cron schedule for automatic crawling and saves, then the system applies the schedule and triggers crawl batches automatically at the configured intervals. *(Admin đang đăng nhập cấu hình cron schedule cho crawl tự động và lưu — hệ thống áp dụng lịch và tự động kích hoạt batch crawl theo tần suất đã cấu hình.)*

AC-46-02: Given an Admin is logged in, when the Admin manually triggers a crawl, then the system starts a new crawl batch immediately regardless of the scheduled time. *(Admin đang đăng nhập và kích hoạt crawl thủ công — hệ thống bắt đầu batch crawl mới ngay lập tức bất kể thời gian lên lịch.)*

AC-46-03: Given a crawl schedule is configured, when the Admin opens the crawl dashboard, then the system displays the crawl history and the current schedule status. *(Lịch crawl đã được cấu hình — khi Admin mở crawl dashboard, hệ thống hiển thị lịch sử crawl và trạng thái lịch hiện tại.)*

NAC-46-01: The system must not allow a crawl schedule interval of less than 24 hours to prevent overloading the data source. *(Hệ thống không được cho phép cấu hình tần suất crawl ngắn hơn 24 giờ để tránh quá tải nguồn dữ liệu.)*

NAC-46-02: The system must not lose the configured crawl schedule after a system restart. *(Hệ thống không được mất cấu hình lịch crawl sau khi khởi động lại hệ thống.)*

## FT-55: Crawler Adapter Management

AC-47-01: Given an Admin is logged in, when the Admin enables a crawler adapter, then the system activates the adapter and makes it available for crawl execution. *(Admin đang đăng nhập bật một crawler adapter — hệ thống kích hoạt adapter và đưa vào sẵn sàng để chạy crawl.)*

AC-47-02: Given an Admin is logged in, when the Admin disables a crawler adapter, then the system deactivates the adapter and prevents it from being used in subsequent crawl batches. *(Admin đang đăng nhập tắt một crawler adapter — hệ thống vô hiệu hóa adapter và ngăn sử dụng trong các batch crawl tiếp theo.)*

AC-47-03: Given a crawler adapter exists, when the Admin runs a test connection, then the system attempts to connect to the data source and returns a success or failure result with details. *(Crawler adapter đã tồn tại — khi Admin chạy test connection, hệ thống thử kết nối đến nguồn dữ liệu và trả về kết quả thành công hoặc thất bại kèm chi tiết.)*

NAC-47-01: The system must not allow a crawl batch to run using a disabled adapter. *(Hệ thống không được cho phép chạy batch crawl bằng adapter đang bị tắt.)*

NAC-47-02: The system must not expose API credentials of the data source adapter in the Admin interface. *(Hệ thống không được lộ thông tin xác thực API của adapter nguồn dữ liệu trong giao diện Admin.)*

## FT-56: AI API Provider Configuration

AC-48-01: Given an Admin is logged in, when the Admin configures the AI API provider with endpoint, API key, and model name then saves, then the system applies the configuration and uses it for all subsequent AI pipeline calls. *(Admin đang đăng nhập cấu hình AI API provider với endpoint, API key và tên model rồi lưu — hệ thống áp dụng cấu hình và dùng cho tất cả các lời gọi AI pipeline tiếp theo.)*

AC-48-02: Given the AI API provider is configured, when the Admin views the configuration page, then the system displays real-time token usage statistics for the current provider. *(AI API provider đã được cấu hình — khi Admin xem trang cấu hình, hệ thống hiển thị thống kê sử dụng token real-time cho provider hiện tại.)*

AC-48-02b: Given the AI API token usage reaches 80% of the monthly quota, when the threshold is crossed, then the system sends a warning alert to Admin (BV-41). *(Khi mức sử dụng token AI API đạt 80% quota hàng tháng, hệ thống gửi cảnh báo đến Admin — theo BV-41.)*

AC-48-03: Given an Admin switches to a different AI API provider, when the new configuration is saved, then the system uses the new provider for all subsequent AI calls without requiring a system restart. *(Admin chuyển sang AI API provider khác và lưu cấu hình mới — hệ thống dùng provider mới cho tất cả các lời gọi AI tiếp theo mà không cần khởi động lại hệ thống.)*

NAC-48-01: The system must not expose the AI API key in plaintext in any interface or log. *(Hệ thống không được lộ API key của AI provider dưới dạng văn bản thô trong bất kỳ giao diện hay log nào.)*

NAC-48-02: The system must not allow AI API configuration changes to affect ongoing AI pipeline processes — changes apply only to subsequent calls. *(Hệ thống không được để thay đổi cấu hình AI API ảnh hưởng đến các AI pipeline đang chạy — thay đổi chỉ áp dụng cho các lời gọi tiếp theo.)*

## FT-57: Transcript Column Mapping Preset Management

AC-49-01: Given an Admin is logged in, when the Admin creates a new column mapping preset by defining the mapping between Excel columns and system fields, then the system saves the preset and makes it available for transcript parsing. *(Admin đang đăng nhập tạo preset ánh xạ cột mới bằng cách định nghĩa ánh xạ giữa các cột Excel và trường dữ liệu hệ thống — hệ thống lưu preset và đưa vào sẵn sàng cho việc parse bảng điểm.)*

AC-49-02: Given a column mapping preset exists, when the Admin runs a test with a sample transcript file, then the system attempts to parse the file using the preset and displays the parsed result for Admin to verify. *(Preset ánh xạ cột đã tồn tại — khi Admin chạy test với file bảng điểm mẫu, hệ thống thử parse file theo preset và hiển thị kết quả parse để Admin xác minh.)*

AC-49-03: Given a column mapping preset has been tested and verified, when the Admin activates the preset, then the system applies it as the default mapping for all subsequent transcript submissions. *(Preset ánh xạ cột đã được test và xác minh — khi Admin kích hoạt preset, hệ thống áp dụng làm ánh xạ mặc định cho tất cả các lần nộp bảng điểm tiếp theo.)*

NAC-49-01: The system must not allow more than one active column mapping preset at the same time. *(Hệ thống không được cho phép có nhiều hơn một preset ánh xạ cột đang active cùng một lúc.)*

NAC-49-02: The system must not apply an untested preset to actual Student transcript submissions. *(Hệ thống không được áp dụng preset chưa qua kiểm thử vào việc parse bảng điểm thực tế của Student.)*

NAC-49-03: The system must not expose sample transcript file content to unauthorized users during preset testing. *(Hệ thống không được lộ nội dung file bảng điểm mẫu cho người dùng không có quyền trong quá trình kiểm thử preset.)*

## FT-50: Trending Weight Rollback

AC-52-01: Given a Trending Weight has been previously approved for a Narrow Specialization, when the Content Manager initiates a rollback, then the system restores it to the immediately preceding approved value and applies it starting from the next Compatibility Score calculation. *(Trending Weight đã được approve trước đó cho một NS — khi Content Manager rollback, hệ thống khôi phục về giá trị approve ngay trước đó và áp dụng từ lần tính Compatibility Score tiếp theo.)*

AC-52-02: Given a rollback has been performed, when Compatibility Scores that were calculated before the rollback are reviewed, then those scores remain unchanged. *(Rollback đã được thực hiện — các Compatibility Score đã tính trước khi rollback không bị thay đổi, theo BR-04.)*

NAC-52-01: The system must not allow rollback beyond the immediately preceding approved value. *(Hệ thống không cho phép rollback xa hơn 1 bước trong v1.0 — không có lựa chọn mốc lịch sử tùy ý.)*

NAC-52-02: The system must not require re-approval for a rollback action. *(Hệ thống không yêu cầu phê duyệt lại cho hành động rollback.)*

NAC-52-03: The system must not display or enable the rollback action for a Narrow Specialization that has no previously approved Trending Weight. *(Hệ thống không hiển thị hoặc không cho bấm nút rollback đối với Narrow Specialization chưa từng có Trending Weight được approve.)*

## FT-12: Notification Inbox View

AC-53-01: Given a user has received at least one notification, when they open the notification inbox, then the system displays all notifications ordered by most recent first, with content, timestamp, and read/unread status. *(Người dùng đã nhận thông báo — khi mở inbox, hệ thống hiển thị tất cả theo thứ tự mới nhất trước, kèm nội dung, thời điểm, trạng thái đọc.)*

AC-53-02: Given a notification references a specific entity, when the user clicks the notification, then the system navigates them directly to the relevant screen. *(Thông báo tham chiếu một entity cụ thể — khi người dùng click vào, hệ thống điều hướng trực tiếp đến màn hình liên quan.)*

NAC-53-01: The system must not display notifications belonging to another user's account. *(Hệ thống không được hiển thị thông báo thuộc tài khoản người dùng khác.)*

AC-53-03: Given a notification is displayed as unread, when the user marks it as read or opens it, then the system updates its status to read and reflects the change immediately in the inbox list. *(Thông báo đang chưa đọc — khi người dùng đánh dấu đã đọc hoặc mở thông báo, hệ thống cập nhật trạng thái và phản ánh ngay trong danh sách.)*

## FT-25: Market Signal Display in Recommendation View

AC-54-01: Given Compatibility Scores have been ranked for a Student's Specialization (FT-22), when the Student views a specific Narrow Specialization in the result, then the system displays current job count and reference salary range sourced from the latest approved Trending Weight data. *(Compatibility Score đã xếp hạng — khi Student xem một NS cụ thể, hệ thống hiển thị số lượng việc làm hiện có và mức lương tham chiếu từ Trending Weight đã approve gần nhất.)*

NAC-54-01: The system must not display market signal data for Narrow Specializations outside the Student's declared Specialization. *(Hệ thống không được hiển thị tín hiệu thị trường cho NS ngoài Specialization đã khai báo của Student, theo BR-08.)*

AC-54-02: Given Compatibility Scores have been ranked but the Narrow Specialization being viewed does not yet have approved Trending Weight data, when the Student views that Narrow Specialization, then the system displays a message indicating market signal data is not yet available, instead of showing blank or zero values. *(NS đang xem chưa có Trending Weight được approve — hệ thống hiển thị thông báo **"**chưa có dữ liệu**"** thay vì để trống hoặc hiển thị 0.)*

## FT-58: Tuition Configuration Management

AC-55-01: Given an Admin is logged in, when the Admin creates or updates a retake credit price for a specific academic year within the valid range (BV-46), then the system saves the value and records the update timestamp and actor identity. *(Admin tạo hoặc sửa giá tín chỉ lượt về cho một năm học cụ thể trong khoảng hợp lệ — hệ thống lưu giá trị, ghi nhận thời điểm cập nhật và actor thực hiện.)*

AC-55-02: Given a retake credit price configuration has been updated, when a Student runs Transfer Cost Analysis (FT-34) afterward, then the system uses the latest saved credit price and displays its last-updated date per BR-47. *(Cấu hình giá tín chỉ lượt về đã được cập nhật — khi Student chạy Transfer Cost Analysis sau đó, hệ thống dùng giá trị mới nhất và hiển thị ngày cập nhật theo BR-47.)*

NAC-55-01: The system must not accept a retake credit price below 1,000 VND as defined in BV-46. *(Hệ thống không được chấp nhận giá trị tín chỉ lượt về dưới 1.000 VND theo BV-46.)*

AC-55-03: Given retake credit price configurations exist for one or more academic years, when the Admin opens the credit price configuration page, then the system displays the full list with academic year, credit price, and last-updated date/actor for each entry. *(Đã có cấu hình giá tín chỉ lượt về cho ít nhất 1 năm học — khi Admin mở trang cấu hình, hệ thống hiển thị toàn bộ danh sách kèm năm học, giá tín chỉ và thông tin cập nhật lần cuối.)*

## FT-13: Content Error Report Resolution

AC-56-01: Given Content Error Reports exist, when a Content Manager opens the report management page, then the system displays all reports with description, related page/content, and current status. *(Content Manager mở trang quản lý báo cáo lỗi — hệ thống hiển thị toàn bộ báo cáo kèm mô tả, nội dung liên quan, và trạng thái hiện tại.)*

AC-56-02: Given the report list is displayed, when the Content Manager filters by status, then the system narrows the list to only reports matching the selected status. *(Danh sách báo cáo được hiển thị — khi CM lọc theo trạng thái, hệ thống thu hẹp danh sách chỉ còn báo cáo khớp trạng thái đã chọn.)*

AC-56-03: Given a Content Manager selects a report, when the Content Manager updates its status, then the system saves the change immediately and reflects it in the list. *(CM chọn một báo cáo và cập nhật trạng thái — hệ thống lưu thay đổi ngay và phản ánh trong danh sách.)*

NAC-56-01: The system must not allow the Content Manager to modify the original report content submitted by the Student — only the processing status field may be updated. *(Content Manager chỉ được cập nhật trạng thái xử lý — không được sửa nội dung báo cáo gốc do Student gửi, để bảo toàn tính nguyên vẹn phục vụ audit.)*

## FT-26: Compatibility Score Weight Configuration

AC-57-01: Given a Content Manager changes one of the three Compatibility Score weights (academic, skill/interest, market), when the change is made, then the system automatically rescales the other two weights proportionally to their current ratio so the total remains 100%. *(CM thay đổi một trong 3 trọng số — hệ thống tự động điều chỉnh tỷ lệ 2 trọng số còn lại theo đúng tỷ lệ hiện có để tổng vẫn bằng 100%.)*

AC-57-02: Given a new weight configuration is saved, when the Content Manager confirms, then the system applies the new weights only to subsequent Compatibility Score calculations and records the change timestamp and the Content Manager who made it. *(Cấu hình trọng số mới được lưu — hệ thống chỉ áp dụng cho các lần tính tiếp theo, ghi nhận thời điểm và CM thực hiện thay đổi.)*

AC-57-03: Given weight configuration changes exist, when a Content Manager opens the configuration page, then the system displays the current weights and a history of past changes with timestamps and the Content Manager who made each change. *(Khi CM mở trang cấu hình — hệ thống hiển thị trọng số hiện tại và lịch sử các lần thay đổi trước đó kèm thời điểm và người thực hiện.)*

NAC-57-01: The system must not accept a weight value that is zero, negative, or results in any of the three weights exceeding 100%. *(Hệ thống không được chấp nhận giá trị trọng số bằng 0, âm, hoặc khiến một trong 3 trọng số vượt quá 100%.)*

## FT-59: System Overview Dashboard

AC-58-01: Given an Admin opens the system overview dashboard, when the page loads, then the system displays summary figures for user accounts, catalog publication status, latest crawl batch status, pending Trending Weight proposals, and current-period AI token usage, each sourced from its respective module without recalculation. *(Admin mở trang dashboard tổng quan — hệ thống hiển thị số liệu tổng hợp về tài khoản người dùng, trạng thái publish catalog, trạng thái crawl batch gần nhất, đề xuất Trending Weight đang chờ duyệt, và token usage AI trong kỳ hiện tại, lấy từ module nguồn tương ứng không tính lại.)*

AC-58-02: Given the dashboard is displayed, when the Admin clicks a summary figure, then the system navigates to the corresponding detail page for that module. *(Dashboard được hiển thị — khi Admin nhấn vào một ô số liệu, hệ thống điều hướng đến trang chi tiết tương ứng của module đó.)*

NAC-58-01: The system must not block the dashboard from loading if one source module is temporarily unavailable — that figure must show a "no data" state while the rest of the dashboard renders normally. *(Hệ thống không được chặn dashboard tải khi một module nguồn tạm thời không khả dụng — ô đó hiển thị trạng thái **"**không có dữ liệu**"** trong khi phần còn lại vẫn hiển thị bình thường.)*

NAC-58-02: The system must not provide any write/edit action directly from the dashboard — all changes must go through the respective detail page. *(Hệ thống không được cung cấp hành động ghi/sửa trực tiếp từ dashboard — mọi thay đổi phải thực hiện qua trang chi tiết tương ứng.)*