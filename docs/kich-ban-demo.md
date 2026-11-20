# Kịch bản demo trên Ganache Desktop

## Chuẩn bị

Mở Ganache Desktop với tài khoản test admin, hai cử tri và một tài khoản chưa đăng ký. Mở `contracts/Election.sol` trong Remix, chọn Solidity `0.8.24`, EVM `paris` và optimizer `200` runs. Đặt sẵn các terminal cho Hardhat, Flask và Vite khi phần web đã tích hợp. Kiểm tra MetaMask sử dụng đúng RPC và Chain ID của workspace.

| Phút | Phụ trách | Thao tác và bằng chứng |
| --- | --- | --- |
| 0–2 | Thành viên 1 | Trình bày vòng đời và compile hợp đồng trong Remix. Chạy `npm.cmd run deploy:ganache`, đối chiếu giao dịch trong Ganache. Chỉ ra địa chỉ admin, địa chỉ hợp đồng và `deployments/local.json`. |
| 2–4 | Thành viên 2 | Mở web đã kết nối với bản deploy mới. Dùng ví admin thêm hai ứng viên, đăng ký hai cử tri và mở bầu cử. |
| 4–7 | Thành viên 2 | Chuyển sang ví cử tri, chọn ứng viên và ký. So sánh số phiếu trước và sau xác nhận. Mở trang xem công khai để kiểm tra cùng kết quả. |
| 7–9 | Cả hai | Thành viên 1 chạy test dưới đây để chứng minh hợp đồng trả `AlreadyVoted` và giữ nguyên kết quả. Thành viên 2 dùng ví admin đóng bầu cử và xác nhận vẫn đọc được kết quả cuối. |
| 9–10 | Thành viên 1 | Mở bảng gas và giải thích khác biệt giữa hai cách lưu trạng thái cử tri. |

```powershell
npx.cmd hardhat test mocha --grep "rejects a second vote"
```

Dùng kết quả và mã giao dịch trong [bảng gas](ket-qua-do-gas.md). Nếu chạy lại phép đo, `npm.cmd run gas:ganache` dùng các hợp đồng riêng và giữ nguyên kết quả cuộc bầu cử dùng cho web.
