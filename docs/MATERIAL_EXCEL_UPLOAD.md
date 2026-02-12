# Material Inventory Excel Upload Template (Markmas Format)

## Kolom yang Diperlukan (Markmas Standard)

Sistem sekarang mendukung format Markmas lengkap. Berikut adalah kolom yang dapat Anda gunakan:

### Kolom Identifikasi Utama:
1. **DWG_NO** - Nomor Gambar
2. **ITEM_NO** - Nomor Item
3. **MARK_NO** - Nomor Mark (Penting untuk penomoran unik)
4. **MARK_SPEC** / **Material Description** - Deskripsi atau Spesifikasi Mark
5. **MAT_SPEC_MEMBER_REF_NO** - Referensi Spesifikasi Material

### Kolom Teknis & Dimensi:
6. **QTY_MARK** / **Quantity** - Jumlah Unit
7. **MAX_LENGTH** - Panjang Maksimum (mm)
8. **MAX_WIDTH** - Lebar Maksimum (mm)
9. **MAX_HEIGHT** - Tinggi Maksimum (mm)
10. **T_WEIGHT** - Total Berat (kg)
11. **T_AREA** - Total Luas Area (m²)

### Kolom Tambahan:
12. **COUNT_NO** - Nomor Count
13. **DI_INCH** - Diameter (Inch)
14. **E_DWG** - Engineering Drawing
15. **PAINT_SYS** - System Pengecatan
16. **ASSY_MARK** - Assembly Mark
17. **REMARK** - Catatan Tambahan

## Alternatif Nama Kolom

Sistem akan mengenali variasi nama kolom berikut:

- **Material Description**: MARK_SPEC, Description, Item
- **Heat Number**: MARK_NO, Heat No, Heat
- **Quantity**: QTY_MARK, Qty
- **Specification**: MAT_SPEC_MEMBER_REF_NO, Spec, Grade
- **Weight**: T_WEIGHT, Total Weight
- **Area**: T_AREA, Total Area

## Contoh Data Excel (Markmas Style)

| DWG_NO | ITEM_NO | MARK_NO | MARK_SPEC | MAT_SPEC_MEMBER_REF_NO | QTY_MARK | T_WEIGHT | PAINT_SYS |
|--------|---------|---------|-----------|------------------------|----------|----------|-----------|
| B-001  | 01      | MK-101  | BEAM      | ASTM A36               | 10       | 150.50   | SYS-1     |
| P-102  | 05      | MK-102  | PLATE     | SA516 GR 70            | 5        | 85.00    | SYS-2     |

## Catatan Penting

| Material Description | Specification | Heat Number | Quantity | Unit | Size | Supplier |
|---------------------|---------------|-------------|----------|------|------|----------|
| Steel Plate ASTM A36 | ASTM A36 | HT-2024-001 | 50 | pcs | 12mm x 1500 x 6000 | PT Steel Indonesia |
| Pipe SA106 Gr.B | SA106 Gr.B | HT-2024-002 | 100 | m | 6" SCH 40 | CV Pipa Jaya |
| Elbow 90° LR | ASTM A234 WPB | HT-2024-003 | 25 | pcs | 6" SCH 40 | PT Fitting Nusantara |

## Catatan Penting

1. **Format File**: Hanya file Excel (.xlsx atau .xls) yang diterima
2. **Sheet Pertama**: Data akan dibaca dari sheet pertama dalam workbook
3. **Header Row**: Baris pertama harus berisi nama kolom
4. **Data Validation**: 
   - Material Description tidak boleh kosong
   - Heat Number tidak boleh kosong
   - Quantity harus berupa angka dan lebih besar dari 0
5. **Duplikasi**: Material dengan heat number yang sama akan di-skip
6. **Maksimal File**: 10MB

## Cara Upload

1. Klik tombol **"Upload Excel"** di halaman Material Inventory
2. Pilih file Excel Anda
3. Sistem akan menampilkan preview 10 baris pertama
4. Jika ada error validasi, akan ditampilkan pesan error
5. Klik **"Import Materials"** untuk memproses data
6. Tunggu hingga proses selesai

## Tips

- Pastikan format data sudah benar sebelum upload
- Gunakan template ini sebagai panduan
- Periksa preview data sebelum melakukan import
- Jika ada banyak error, perbaiki file Excel dan upload ulang
