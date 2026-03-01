export function getDisplayDate(dateString: string | Date): Date {
    const date = new Date(dateString);
    // Cộng thêm 1 ngày (24 giờ) vào thời gian gốc
    date.setDate(date.getDate() + 1);
    return date;
}
