export function getDisplayDate(dateString: string | Date, isTip: boolean = false): Date {
    const date = new Date(dateString);
    if (isTip) {
        // Chỉ cộng thêm 1 ngày (24 giờ) vào thời gian gốc đối với tiền Tips
        date.setDate(date.getDate() + 1);
    }
    return date;
}
