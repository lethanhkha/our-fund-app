require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];

fs.createReadStream('expense_clean.csv')
    .pipe(csv())
    .on('data', (row) => {
        // We adjust exact keys to match what is really inside `expense_clean.csv`
        const payload = {
            wallet_id: row['wallet_id'] ? row['wallet_id'].trim() : null,
            type: 'expense',
            amount: parseInt(row['amount']),
            category: row['category'] ? row['category'].trim() : 'Khác',
            note: row['note'] ? row['note'].trim() : '',
            created_at: row['created_at'] ? row['created_at'].trim() : new Date().toISOString()
        };
        results.push(payload);
    })
    .on('end', async () => {
        console.log(`Đã đọc ${results.length} dòng từ CSV. Đang bơm lên Supabase...`);

        // Split into smaller batches if needed, but 470 records usually fits in one insert
        const { data, error } = await supabase
            .from('transactions')
            .insert(results);

        if (error) {
            console.error('❌ Lỗi khi bơm chi tiêu:', error);
        } else {
            console.log('✅ Hoàn tất bơm dữ liệu chi tiêu! Đã bơm toàn bộ dữ liệu.');
        }
    });
