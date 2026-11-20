# Bầu cử lớp hoặc câu lạc bộ trên Ethereum

Mỗi bản triển khai `Election` đại diện cho một cuộc bầu cử công khai. Admin đăng ký địa chỉ cử tri và ứng viên, mở rồi đóng bầu cử. Trong lúc mở, mỗi địa chỉ đã đăng ký bỏ được một phiếu. Kết quả theo ứng viên có thể đọc ở mọi giai đoạn.

## Yêu cầu môi trường

- Node.js từ 22.13.0, npm, Ganache Desktop và Remix IDE.
- Dự án ghim Hardhat 3.22.0 và Solidity 0.8.24 trong npm. Cấu hình compiler dùng EVM `paris`, optimizer bật, `200` runs.

## Biên dịch và kiểm thử

Chạy từ thư mục gốc của repository trên PowerShell.

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd test
```

Test chạy trên mạng mô phỏng của Hardhat. Xem [kết quả kiểm thử](docs/ket-qua-kiem-thu.md) và [mô tả hợp đồng dành cho tích hợp](docs/thiet-ke-hop-dong.md).

## Triển khai lên Ganache Desktop

1. Mở Ethereum workspace trong Ganache Desktop. Cho phép dùng các tài khoản test cục bộ và bật Automine.
2. Mặc định dự án kết nối `http://127.0.0.1:7545` với Chain ID `1337`. Nếu workspace dùng giá trị khác, đặt biến `GANACHE_RPC_URL` và `GANACHE_CHAIN_ID` trong terminal. Chain ID lấy bằng `eth_chainId`; Network ID hiển thị trong Ganache là một giá trị riêng.
3. Chạy lệnh triển khai.

```powershell
npm.cmd run deploy:ganache
```

Script in địa chỉ hợp đồng, admin test, mã giao dịch và gas triển khai. Sau khi giao dịch thành công, script tạo `deployments/local.json` với `rpcUrl`, `chainId`, `address` và mảng `abi`. Hợp đồng mới ở `Setup`. Chạy lại lệnh sẽ tạo một cuộc bầu cử mới và cập nhật tệp cấu hình local.

## Thử hợp đồng với Remix IDE

Mở `contracts/Election.sol` và đặt compiler `0.8.24`, EVM `paris`, optimizer `200` runs trong **Solidity Compiler**. Trong **Deploy & Run**, dùng Remix VM cho phép thử riêng, hoặc **External HTTP Provider** trỏ tới Ganache Desktop. Để thao tác trên hợp đồng Hardhat đã triển khai, chọn `Election` và dùng chức năng nạp hợp đồng theo địa chỉ từ `deployments/local.json`. Tài khoản gửi giao dịch quản trị phải trùng `owner()`.

## Đo gas

```powershell
npm.cmd run gas:ganache
```

Dùng cùng workspace Ganache với ít nhất ba tài khoản test đã mở khóa. Script triển khai hai hợp đồng riêng, thực hiện cùng chuỗi giao dịch và in `gasUsed` cùng mã từng giao dịch. Kết quả đo và cách giải thích nằm trong [báo cáo gas](docs/ket-qua-do-gas.md).

## Bàn giao giao diện

- [Tài liệu triển khai FE và BE](docs/trien-khai-fe-be.md) mô tả kiến trúc Flask, Web3.py, JavaScript và MetaMask, cùng API và các bước chạy dự kiến.
- [Kịch bản demo](docs/kich-ban-demo.md) mô tả các bước chuẩn bị workspace, hợp đồng và tài khoản test.
