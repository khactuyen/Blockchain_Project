# Tiến độ đồ án bầu cử trên blockchain

**Cập nhật 17/11/2026** · Theo [tài liệu phân công](phan-cong-cong-viec.md)

## Thành viên 1 — Tuyên

| Mã | Đầu việc | Trạng thái | Kết quả và bước tiếp theo |
| --- | --- | --- | --- |
| SC-01 | Chốt giao diện hợp đồng | Chờ đối chiếu | Đã ghi chữ ký hàm, kiểu dữ liệu, sự kiện và cấu hình deploy trong [tài liệu bàn giao](thiet-ke-hop-dong.md). Hải đối chiếu khi tích hợp FE/BE. |
| SC-02 | Viết Solidity và thử trên Remix | Còn bước Remix | `Election.sol` đã biên dịch bằng Hardhat và chạy được trên Ganache Desktop. Cần mở hợp đồng trong Remix, biên dịch và thử tương tác theo [README](../README.md#thử-hợp-đồng-với-remix-ide). |
| SC-03 | Kiểm thử Hardhat | Hoàn tất | [12 ca đạt, 0 lỗi](ket-qua-kiem-thu.md), gồm phân quyền, bỏ phiếu lần hai và các ca ngoài giai đoạn. |
| SC-04 | Deploy lên Ganache Desktop | Hoàn tất | Đã xác minh ABI và địa chỉ trong `deployments/local.json` kết nối đúng hợp đồng. Bản deploy được bàn giao ở trạng thái `Setup`. [Thông tin bản deploy](thiet-ke-hop-dong.md#bản-triển-khai-bàn-giao-trên-ganache-desktop) |
| SC-05 | Đo gas và so sánh tối ưu | Hoàn tất | Đo bằng hai hợp đồng riêng trên Ganache Desktop. Một mapping trạng thái giảm 19.196 gas mỗi lượt bỏ phiếu trong phép đo. [Bảng gas](ket-qua-do-gas.md) |
| SC-06 | Nội dung kỹ thuật và demo | Sẵn sàng bàn giao | Đã soạn thiết kế, bảo mật, kết quả đo và [kịch bản demo](kich-ban-demo.md). Cần tập demo chung sau khi tích hợp web. |

## Thành viên 2 — Hải

| Mã | Đầu việc | Trạng thái |
| --- | --- | --- |
| WEB-01 | API Flask và Web3.py | Có cấu hình deploy để tích hợp. Chưa có mã nguồn trong workspace. |
| WEB-02–03 | Frontend JavaScript và MetaMask | Có [đặc tả FE/BE](trien-khai-fe-be.md). Chưa có mã nguồn trong workspace. |
| WEB-04–05 | Kiểm thử tích hợp, hướng dẫn web và demo | Chờ ứng dụng web. |

## Mốc tiếp theo

1. Tuyên xác minh biên dịch và tương tác trong Remix, rồi ghi kết quả vào tài liệu kiểm thử.
2. Hải đọc biểu mẫu deployment, chạy Flask và frontend với cùng workspace Ganache, rồi thử một giao dịch qua MetaMask và đối chiếu kết quả trên web.
3. Cả hai ghép báo cáo 4–6 trang và tập demo 10 phút sau khi tích hợp thành công. Commit–reveal thuộc phần mở rộng sau mốc này.
