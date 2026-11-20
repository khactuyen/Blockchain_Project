# Kết quả kiểm thử hợp đồng Election

## Môi trường và kết quả

| Thành phần | Giá trị |
| --- | --- |
| Lệnh | `npm.cmd test` |
| Môi trường | Windows, Node.js 24.14.1, Hardhat 3.22.0, mạng mô phỏng Hardhat |
| Compiler | Solidity 0.8.24, EVM `paris`, optimizer 200 runs |
| Kết quả | **12 ca đạt, 0 lỗi** |

```text
Compiled 2 Solidity files with solc 0.8.24 (evm target: paris)
12 passing (12 mocha)
```

## Các ca đã chạy

| # | Kiểm tra | Kết quả xác minh |
| ---: | --- | --- |
| 1 | Trạng thái ban đầu | `Setup`, owner là người triển khai, danh sách trống. |
| 2 | Quy trình đầy đủ | Đăng ký, mở, bỏ phiếu, đọc kết quả trực tiếp và đóng. Xác minh các sự kiện ghi chính. |
| 3 | Tài khoản thường gọi bốn hàm admin | `Unauthorized`. |
| 4 | Địa chỉ zero và đăng ký lại | `InvalidVoter` và `VoterAlreadyRegistered`. Số cử tri giữ nguyên. |
| 5 | Tên rỗng và hai ứng viên cùng tên | `EmptyCandidateName`. Tên trùng có hai mã riêng. |
| 6 | Mở khi thiếu cử tri hoặc ứng viên | `NoVoters` và `NoCandidates`. Giai đoạn vẫn là `Setup`. |
| 7 | Đóng trước khi mở | `WrongPhase`. |
| 8 | Sửa danh sách hoặc mở lại khi đang `Open` | `WrongPhase`. Số cử tri và ứng viên giữ nguyên. |
| 9 | Tài khoản chưa đăng ký, kể cả admin, bỏ phiếu | `NotRegistered`. Số phiếu giữ nguyên. |
| 10 | Cùng địa chỉ bỏ phiếu lần hai | `AlreadyVoted`. Trạng thái cử tri và cả hai bộ đếm giữ nguyên. |
| 11 | Truy vấn hoặc bỏ phiếu với mã ngoài phạm vi | `InvalidCandidate`. Cử tri vẫn có thể gửi một phiếu hợp lệ. |
| 12 | Bỏ phiếu trước khi mở hoặc sau khi đóng, mở lại, đóng lại | `WrongPhase`. Tư cách cử tri và số phiếu giữ nguyên. |

Các test trên kiểm tra trực tiếp hành vi Solidity. Ngoài ra, đã đọc `owner()`, `phase()`, `candidateCount()` và `eligibleVoterCount()` trên Ganache Desktop bằng ABI và địa chỉ xuất ra từ script. Đã xác nhận đúng Chain ID và hợp đồng ở `Setup` với danh sách trống. Bước biên dịch và thử tương tác trong giao diện Remix vẫn cần xác minh trực tiếp. Kết quả chạy qua Flask, Vite và MetaMask sẽ được bổ sung sau khi tích hợp mã của Thành viên 2.
