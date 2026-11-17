# Phân công công việc đồ án bầu cử trên blockchain

| Thông tin | Nội dung |
| --- | --- |
| Nhóm | Hai thành viên |
| Thành viên 1 | Tuyên |
| Thành viên 2 | Hải |
| Phạm vi bắt buộc | Bầu cử công khai trên Ganache Desktop, có hợp đồng Solidity, ứng dụng web, kiểm thử và đo gas |
| Phạm vi mở rộng | Bỏ phiếu commit–reveal. Thực hiện sau khi nghiệm thu bản công khai. |
| Tài liệu đối chiếu | [Yêu cầu đồ án](yeu-cau.md), [Triển khai hợp đồng](trien-khai.md), [Triển khai frontend và backend](trien-khai-fe-be.md) |

Thành viên 1 phụ trách hợp đồng, công cụ triển khai và kiểm thử trên blockchain. Thành viên 2 phụ trách ứng dụng web và kiểm thử tích hợp. Mỗi người bàn giao mã nguồn, hướng dẫn chạy phần mình và bằng chứng nghiệm thu. Hai thành viên cùng chốt giao diện hợp đồng và chạy thử bản nộp.

## 1. Thành viên 1 — Hợp đồng, kiểm thử và đo gas

| Mã | Công việc | Đầu ra và tiêu chí hoàn thành |
| --- | --- | --- |
| SC-01 | Chốt giao diện `Election` với Thành viên 2 | Thống nhất chữ ký hàm đọc và ghi, kiểu trả về, các trạng thái `Setup`, `Open`, `Closed` và các sự kiện. Ghi rõ `getCandidate(id)` trả tên và số phiếu theo thứ tự nào. Thống nhất cấu trúc `deployments/local.json`. |
| SC-02 | Viết hợp đồng bằng Solidity 0.8.24 và thử trên Remix IDE | `contracts/Election.sol` phân quyền admin, khóa danh sách khi mở, kiểm tra tư cách cử tri và chỉ chấp nhận một phiếu hợp lệ mỗi địa chỉ. Đọc được kết quả ở mọi giai đoạn. Các thao tác ghi chính phát sự kiện. Hợp đồng biên dịch và thử được trên Remix. |
| SC-03 | Viết kiểm thử tự động bằng Hardhat | `test/Election.ts` kiểm tra luồng đăng ký, mở, bỏ phiếu, đọc kết quả, đóng và xác minh các sự kiện. Có ít nhất ba ca revert. Ưu tiên kiểm tra trái quyền, chưa đăng ký và bỏ phiếu lần hai. Bổ sung mã ứng viên sai và bỏ phiếu ngoài giai đoạn `Open`. Ghi kết quả chạy thực tế. |
| SC-04 | Triển khai và bàn giao cấu hình Ganache | `scripts/deploy.ts` triển khai bằng Hardhat lên Ganache Desktop. Sau khi giao dịch xác nhận, script xuất `rpcUrl`, `chainId`, `address`, `abi` vào `deployments/local.json`. Bàn giao lệnh chạy, cách tạo lại cấu hình và địa chỉ tài khoản admin test trên workspace demo. |
| SC-05 | Đo gas và đánh giá tối ưu | `scripts/measure-gas.ts` lấy `gasUsed` từ biên nhận trên Ganache cho deploy, đăng ký cử tri, thêm ứng viên, mở, bỏ phiếu và đóng. Đo riêng phiếu đầu và phiếu tiếp theo cho cùng ứng viên. So sánh thiết kế một mapping trạng thái cử tri với bản dùng hai mapping trong cùng điều kiện. Ghi số liệu vào `docs/ket-qua-do-gas.md`. |
| SC-06 | Viết phần kỹ thuật của báo cáo và chuẩn bị demo | Bàn giao sơ đồ hợp đồng, mô tả phân quyền, giới hạn bảo mật, kết quả test và phân tích gas. Phụ trách trình diễn Remix, deploy bằng Hardhat và ca revert. |

## 2. Thành viên 2 — Backend, frontend và tích hợp

| Mã | Công việc | Đầu ra và tiêu chí hoàn thành |
| --- | --- | --- |
| WEB-01 | Xây dựng backend Flask và Web3.py | `backend/` đọc `deployments/local.json`, kết nối Ganache bằng RPC và khởi tạo hợp đồng bằng ABI cùng địa chỉ. Cung cấp `GET /api/health`, `GET /api/deployment` và `GET /api/results`. Kiểm tra được phản hồi khi Ganache dừng hoặc gửi địa chỉ cử tri sai định dạng. |
| WEB-02 | Xây dựng giao diện JavaScript | `frontend/` dùng JavaScript thuần, HTML và CSS. Trang hiển thị giai đoạn, danh sách ứng viên và số phiếu từ API ngay cả khi chưa kết nối ví. Có giao diện theo vai trò admin và cử tri. |
| WEB-03 | Tích hợp ethers.js và MetaMask | Admin gửi được giao dịch đăng ký cử tri, thêm ứng viên, mở và đóng bầu cử. Cử tri đủ điều kiện ký được giao dịch bỏ phiếu. Giao diện cập nhật sau xác nhận và xử lý đổi tài khoản, sai mạng hoặc hủy ký. |
| WEB-04 | Kiểm thử tích hợp FE, BE và Ganache | Kiểm tra cả luồng thành công và các tình huống sai mạng, địa chỉ chưa đăng ký, kết quả cập nhật ở trang xem công khai. Ghi bước chạy, kết quả thực tế và lỗi phát hiện vào `docs/ket-qua-kiem-thu.md` cùng bằng chứng test của Thành viên 1. |
| WEB-05 | Hoàn thiện hướng dẫn chạy web và chuẩn bị demo | Bổ sung README với cách chạy Flask, Vite và kết nối MetaMask. Viết phần kiến trúc FE/BE và luồng người dùng trong báo cáo. Phụ trách demo thao tác trên trang web, ký phiếu và xem kết quả. |

## 3. Mốc thực hiện và bàn giao

| Mốc | Cách phối hợp | Điều kiện kết thúc |
| --- | --- | --- |
| **M1 — Thống nhất giao diện** | Thành viên 1 đề xuất chữ ký hàm, kiểu dữ liệu và cấu trúc deployment. Thành viên 2 đối chiếu với API và luồng MetaMask. | Hai người thống nhất thông tin đầu vào và đầu ra. Thành viên 2 có thể dựng phần hiển thị bằng dữ liệu mẫu trong khi Thành viên 1 viết hợp đồng. |
| **M2 — Tích hợp bản deploy đầu tiên** | Thành viên 1 hoàn thành hợp đồng, chạy test và bàn giao script deploy. Thành viên 2 chạy Flask và web với cấu hình sinh trong workspace Ganache đang dùng. | `/api/health` báo kết nối thành công. Trang đọc đúng danh sách ứng viên. Một giao dịch ký bằng MetaMask xuất hiện trên Ganache và kết quả được cập nhật. |
| **M3 — Nghiệm thu bản bắt buộc** | Thành viên 1 chốt test và đo gas. Thành viên 2 chạy lại các ca tích hợp. Hai người rà soát README và tập demo từ workspace mới. | Có kết quả test và gas thực tế, báo cáo 4–6 trang, README chạy lại được và kịch bản demo 10 phút. |

Trong lần tích hợp, Flask và MetaMask dùng cùng workspace Ganache. Nếu hai người chạy trên hai máy, mỗi người chạy script deploy để tạo `deployments/local.json` cho workspace riêng. Chia sẻ mã nguồn, cấu trúc tệp, lệnh chạy và địa chỉ ví công khai qua repository. Giữ private key và mnemonic ngoài repository.

## 4. Trách nhiệm bàn giao bản cuối

| Hạng mục | Phụ trách tổng hợp | Kiểm tra trước khi nộp |
| --- | --- | --- |
| Repository và README | Thành viên 2 tổng hợp. Thành viên 1 bổ sung hướng dẫn Remix, Hardhat và Ganache. | Một thành viên thử làm theo README trên workspace mới, từ cài thư viện đến xem được kết quả trên web. |
| Kết quả test và gas | Thành viên 1 tổng hợp test hợp đồng và gas. Thành viên 2 bổ sung kết quả tích hợp. | Có lệnh chạy, điều kiện đo, số ca đạt và lỗi, cùng giải thích tối ưu. Số liệu lấy từ lần chạy thực tế. |
| Báo cáo 4–6 trang | Thành viên 2 ghép bản nộp. Thành viên 1 rà soát phần Solidity, sơ đồ hợp đồng và số liệu. | Đủ thiết kế, bảo mật, test và phân tích gas. Hai người duyệt bản cuối trước khi nộp. |
| Demo 10 phút | Cả hai | **Phút 0–2:** Thành viên 1 giới thiệu hợp đồng trong Remix và deploy bằng Hardhat. **Phút 2–7:** Thành viên 2 thao tác admin, kết nối ví cử tri, bỏ phiếu và mở trang xem công khai. **Phút 7–9:** Thành viên 1 minh họa một ca bỏ phiếu bị revert bằng test, Thành viên 2 đóng bầu cử và kiểm tra kết quả cuối. **Phút 9–10:** Thành viên 1 trình bày bảng gas và tối ưu. |

## 5. Phần mở rộng commit–reveal

Sau mốc M3, Thành viên 1 phụ trách thiết kế cam kết, kiểm tra công bố phiếu và kiểm thử sai `salt`, công bố trùng hoặc sai giai đoạn. Thành viên 2 phụ trách màn hình commit, hướng dẫn lưu dữ liệu reveal và tích hợp hai giao dịch ký bằng MetaMask. Hai người nghiệm thu riêng khả năng giấu lựa chọn trong giai đoạn commit và kiểm tra rằng kết quả cuối chỉ tính các phiếu đã reveal hợp lệ.
