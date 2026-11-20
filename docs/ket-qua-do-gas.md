# Kết quả đo gas trên Ganache Desktop

## Phương pháp

Chạy `npm.cmd run gas:ganache` trên Ganache Desktop 2.7.1, engine Ganache 7.7.3, hardfork Merge, Chain ID `1337`, Automine bật. Cả hai bản được biên dịch bằng Solidity `0.8.24`, EVM `paris`, optimizer `200` runs. Script dùng cùng tài khoản admin, hai cử tri, hai tên `An` và `Ly`, và cùng thứ tự thao tác. Hai cử tri đều bỏ phiếu cho ứng viên `0`. Số liệu là `gasUsed` từ giao dịch thành công.

| Bản hợp đồng | Cách lưu trạng thái | Địa chỉ của lần đo |
| --- | --- | --- |
| `Election` | Một mapping từ địa chỉ sang `Unregistered`, `Eligible` hoặc `Voted` | `0x73537d18e3f0DF19C3F30c50b72afA571a68969f` |
| `ElectionTwoMappings` | Hai mapping riêng `eligible` và `hasVoted` | `0x1E1C5682662058eC95a2e5728ac33d60cFE358e1` |

## Số liệu

Cột tiết kiệm bằng gas của bản đối chứng trừ gas của `Election`. Giá trị âm biểu thị `Election` dùng nhiều gas hơn cho thao tác đó.

| Thao tác | `Election` | Hai mapping | Gas tiết kiệm |
| --- | ---: | ---: | ---: |
| Triển khai | 703.888 | 710.363 | 6.475 |
| Đăng ký cử tri thứ nhất | 69.793 | 69.761 | −32 |
| Đăng ký cử tri thứ hai | 52.693 | 52.661 | −32 |
| Thêm ứng viên `0` | 73.511 | 73.511 | 0 |
| Thêm ứng viên `1` | 56.411 | 56.411 | 0 |
| Mở bầu cử | 48.587 | 48.587 | 0 |
| Phiếu đầu tiên cho ứng viên `0` | 54.998 | 74.194 | 19.196 |
| Phiếu tiếp theo cho cùng ứng viên | 37.898 | 57.094 | 19.196 |
| Đóng bầu cử | 27.285 | 27.285 | 0 |

Mã giao dịch phiếu đầu tiên trong `Election` là `0xaed0d53bbd0ab90b51fff44ea57d3a1216dcc618e02c0372a6c2b068c1d9be07`. Giao dịch đối chứng là `0x0acb7aaaaa096bb2a0f3bf3bfa161e2e779d04bbe09bd08bfb1531912f7a3b2c`. Lệnh đo in mã giao dịch của từng dòng để đối chiếu trong Ganache. Hai hợp đồng đo đều kết thúc ở `Closed` với hai phiếu cho ứng viên `0`.

## Phân tích tối ưu

Trong `Election`, địa chỉ đã đăng ký có `voterStatus = Eligible`. Bỏ phiếu chuyển chính ô lưu trữ này sang `Voted`, tức là cập nhật từ một giá trị khác zero sang một giá trị khác zero. Bản đối chứng đọc hai mapping và phải ghi `hasVoted` vào một ô trước đó bằng zero. Phép đo cho thấy tiết kiệm **19.196 gas mỗi phiếu**, tương ứng khoảng **25,9%** ở phiếu đầu tiên và **33,6%** ở phiếu tiếp theo, với chi phí tăng 32 gas cho mỗi lượt đăng ký trong phép đo.

Phiếu đầu tiên tốn hơn phiếu tiếp theo ở cả hai bản vì bộ đếm ứng viên chuyển từ `0` sang `1`. Các lần đo dùng hợp đồng riêng nên cuộc bầu cử bàn giao cho FE/BE vẫn ở `Setup`. Những thao tác đọc qua `eth_call` không tạo giao dịch tính phí.
