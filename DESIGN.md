# Hệ Thống Thiết Kế (Design System) - Honey Money Dashboard

Đây là tài liệu quy chuẩn thiết kế (Kim chỉ nam) cho toàn bộ ứng dụng Honey Money Dashboard, được phân tích trích xuất từ các bản thiết kế trên Stitch (chế độ Light Mode, style cực kỳ mềm mại, nữ tính, bo tròn góc độ cao). 
Mọi màn hình và component khi code UI bằng Tailwind CSS hoặc CSS thuần đều **BẮT BUỘC** tuân theo các token dưới đây để đảm bảo tính nhất quán (UI/UX consistency).

---

## 1. Màu Sắc (Colors)
Thiết kế sử dụng tone màu pastel chủ đạo rất mềm mại, ấm áp kết hợp với màu hồng dưa hấu nổi bật.

### Màu Chính (Primary & Brand)
- **`primary`** (`#ee2b5b`): Màu hồng đỏ/dưa hấu. Dùng cho: Nút bấm chính (CTA), icon đang active, giá trị tiền tệ dương nổi bật.
- **`brandDark`** (`#4a2b33`): Nâu đen pha đỏ. Dùng cho: Tiêu đề màn hình (Header), tên khách hàng/danh mục để không bị gắt như màu đen tuyền.
- **`muted`** (`#8e7178`): Xám nâu nhạt. Dùng cho: Chữ mô tả phụ, thời gian, placeholder.

### Màu Nền (Surfaces & Backgrounds)
- **`surface-bg`** (`#fff9fa`): Màu nền tổng thể của body ứng dụng. Tạo cảm giác sạch sẽ nhưng vẫn giữ được độ ấm của tone pastel.
- **`soft-gradient`** (`linear-gradient(180deg, #fffcfd 0%, #fff9fa 100%)`): Dùng cho khu vực Header dính (sticky) để tạo hiệu ứng chuyển sắc mượt mà.
- **`secondary` / `primary-light`** (`#ffecf0` / `#fff1f4`): Màu nền hồng rất nhạt. Dùng cho: Nền của vùng hiển thị tổng tiền, nền avatar/icon placeholder.
- **`surface`** (`#ffffff`): Trắng tinh khiết dùng cho các khối Card, Bottom Navigation để nổi lên trên bề mặt màu `#fff9fa`.

### Màu Trạng Thái (State Colors)
- **`urgent`** (`#fef2f2`): Nền đỏ cảnh báo nhẹ cho các vùng chứa thông tin "Cần thu gấp", lỗi.
- **`borderUrgent`** (`#fee2e2`): Đường viền cho trạng thái cảnh báo.

---

## 2. Nghệ Thuật Chữ (Typography)
Dự án sử dụng duy nhất một font chữ hiện đại và bo tròn các nét thanh đậm: **`Spline Sans`**.

- **Font Family**: `'Spline Sans', sans-serif`
- **Độ đậm (Font Weights)**:
  - `Light (300)`, `Regular (400)`: Chữ thường, mô tả dài.
  - `Medium (500)`: Chữ hiển thị thông tin metadata.
  - `Semi-bold (600)`: Nút tác vụ phụ.
  - `Bold (700)`: Tiêu đề app, Tên người dùng, Nơi cần nhấn mạnh.
  - `Extra-bold (800)`: Dùng cụ thể cho con số định dạng Tiền tệ lớn (Ví dụ: `250.000`).
- **Kích thước phổ biến**:
  - `text-[10px]`: Text thanh điều hướng, badge/tag.
  - `text-xs` (12px), `text-sm` (14px): Ghi chú, giờ giấc.
  - `text-base` (16px), `text-lg` (18px): Tên button chính.
  - `text-xl` (20px), `text-2xl` (24px): Heading trang, Bàn phím số.
  - `text-5xl` (48px): Giá trị số tiền khổng lồ trung tâm.

---

## 3. Bo Góc (Border Radius) 
Đặc trưng lớn nhất của Dashboard này là phong cách "ROUND_FULL" - bo tròn tối đa tạo cảm giác cực kỳ thân thiện.

- **`rounded-full` (9999px)**: Dùng cho mọi nút (Button), ảnh đại diện (Avatar), bàn phím số (Keypad), badge.
- **`rounded-custom` / `rounded-[2rem]` / `rounded-[2.5rem]` (24px đến 40px)**: Bo góc cực gắt cho các viền Card và thanh điều hướng dưới cùng (Bottom Navigation). Không dùng góc vuông.

---

## 4. Bóng Đổ (Shadows)
Project sử dụng bóng đổ theo tone màu (Colored shadows) để UI trông có chiều sâu và lung linh thay vì shadow xám thông thường.

- **Shadow Card (Cho các khối block trắng)**: `box-shadow: 0 10px 30px -10px rgba(238, 43, 91, 0.1)` (Hồng nhạt mờ mờ phản chiếu xuống hình nền).
- **Shadow Nút Bấm Chính (Primary CTA)**: `shadow-lg shadow-pink-200` tạo sự phát sáng cho nút "Xác nhận" / Floating Action Button.
- **Shadow Bàn Phím / Icon**: `shadow-sm` nhẹ.

---

## 5. Cấu Trúc CSS Tailwind Mở Rộng
*(Có thể đưa thẳng vào `tailwind.config.js` nếu viết project bằng React/Vue)*

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#ee2b5b',
        secondary: '#ffecf0',
        'primary-light': '#fff1f4',
        brandDark: '#4a2b33',
        muted: '#8e7178',
        urgent: '#fef2f2',
        borderUrgent: '#fee2e2'
      },
      fontFamily: {
        sans: ['Spline Sans', 'sans-serif'],
      },
      borderRadius: {
        'custom': '24px',
        // Tái sử dụng các class như rounded-[2rem], rounded-[40px] khi cần
      }
    }
  }
}
```
