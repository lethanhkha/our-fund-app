require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Hoặc SERVICE_ROLE_KEY nếu có
);

async function syncBalances() {
  console.log('🔄 Đang đồng bộ số dư các ví...');

  try {
    // 1. Lấy danh sách tất cả các ví
    const { data: wallets, error: wErr } = await supabase.from('wallets').select('id, name');
    if (wErr) throw wErr;

    for (const wallet of wallets) {
      // 2. Tính Tổng Thu
      const { data: incomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('wallet_id', wallet.id)
        .eq('type', 'income');
      const totalIncome = incomeData?.reduce((sum, row) => sum + row.amount, 0) || 0;

      // 3. Tính Tổng Chi
      const { data: expenseData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('wallet_id', wallet.id)
        .eq('type', 'expense');
      const totalExpense = expenseData?.reduce((sum, row) => sum + row.amount, 0) || 0;

      // 4. Tính Tổng Tips ĐÃ NHẬN
      const { data: tipsData } = await supabase
        .from('tips')
        .select('amount')
        .eq('wallet_id', wallet.id)
        .eq('status', 'received');
      const totalTips = tipsData?.reduce((sum, row) => sum + row.amount, 0) || 0;

      // 5. Tính Số Dư Cuối = Thu - Chi + Tips
      const finalBalance = totalIncome - totalExpense + totalTips;

      // 6. Cập nhật lại vào DB
      const { error: updateErr } = await supabase
        .from('wallets')
        .update({ balance: finalBalance })
        .eq('id', wallet.id);

      if (updateErr) throw updateErr;

      console.log(`✅ [${wallet.name}]: Đã chốt số dư -> ${finalBalance.toLocaleString('vi-VN')} đ`);
    }

    console.log('🎉 Đồng bộ hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi đồng bộ:', error.message);
  }
}

syncBalances();