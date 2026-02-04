// Danh sách các tỉnh thành Việt Nam với tên gốc và các biến thể
export interface CityInfo {
  name: string; // Tên gốc có dấu
  variants: string[]; // Các biến thể không dấu, không khoảng trắng
  lat: number;
  lon: number;
}

export const VIETNAM_CITIES: CityInfo[] = [
  { name: 'Hà Nội', variants: ['ha noi', 'hanoi', 'ha-noi'], lat: 21.0285, lon: 105.8542 },
  { name: 'Hồ Chí Minh', variants: ['ho chi minh', 'hcm', 'saigon', 'sai gon'], lat: 10.8231, lon: 106.6297 },
  { name: 'Đà Nẵng', variants: ['da nang', 'danang'], lat: 16.0544, lon: 108.2022 },
  { name: 'Hải Phòng', variants: ['hai phong', 'haiphong'], lat: 20.8449, lon: 106.6881 },
  { name: 'Cần Thơ', variants: ['can tho', 'cantho'], lat: 10.0452, lon: 105.7469 },
  { name: 'An Giang', variants: ['an giang', 'angiang'], lat: 10.5216, lon: 105.1259 },
  { name: 'Bà Rịa - Vũng Tàu', variants: ['ba ria vung tau', 'bariavungtau', 'vung tau'], lat: 10.3460, lon: 107.0843 },
  { name: 'Bắc Giang', variants: ['bac giang', 'bacgiang'], lat: 21.2734, lon: 106.1946 },
  { name: 'Bắc Kạn', variants: ['bac kan', 'backan'], lat: 22.1470, lon: 105.8342 },
  { name: 'Bạc Liêu', variants: ['bac lieu', 'baclieu'], lat: 9.2942, lon: 105.7278 },
  { name: 'Bắc Ninh', variants: ['bac ninh', 'bacninh'], lat: 21.1861, lon: 106.0763 },
  { name: 'Bến Tre', variants: ['ben tre', 'bentre'], lat: 10.2415, lon: 106.3759 },
  { name: 'Bình Định', variants: ['binh dinh', 'binhdinh'], lat: 13.7750, lon: 109.2233 },
  { name: 'Bình Dương', variants: ['binh duong', 'binhduong'], lat: 11.3254, lon: 106.4770 },
  { name: 'Bình Phước', variants: ['binh phuoc', 'binhphuoc'], lat: 11.6471, lon: 106.6056 },
  { name: 'Bình Thuận', variants: ['binh thuan', 'binhthuan'], lat: 10.9289, lon: 108.1021 },
  { name: 'Cà Mau', variants: ['ca mau', 'camau'], lat: 9.1776, lon: 105.1527 },
  { name: 'Cao Bằng', variants: ['cao bang', 'caobang'], lat: 22.6657, lon: 106.2570 },
  { name: 'Đắk Lắk', variants: ['dak lak', 'daklak', 'dac lac'], lat: 12.7104, lon: 108.2378 },
  { name: 'Đắk Nông', variants: ['dak nong', 'daknong'], lat: 12.0046, lon: 107.6907 },
  { name: 'Điện Biên', variants: ['dien bien', 'dienbien'], lat: 21.4064, lon: 103.0082 },
  { name: 'Đồng Nai', variants: ['dong nai', 'dongnai'], lat: 11.0574, lon: 106.8229 },
  { name: 'Đồng Tháp', variants: ['dong thap', 'dongthap'], lat: 10.4933, lon: 105.6882 },
  { name: 'Gia Lai', variants: ['gia lai', 'gialai'], lat: 13.9833, lon: 108.0000 },
  { name: 'Hà Giang', variants: ['ha giang', 'hagiang'], lat: 22.8184, lon: 104.9784 },
  { name: 'Hà Nam', variants: ['ha nam', 'hanam'], lat: 20.5450, lon: 105.9139 },
  { name: 'Hà Tĩnh', variants: ['ha tinh', 'hatinh'], lat: 18.3429, lon: 105.9059 },
  { name: 'Hải Dương', variants: ['hai duong', 'haiduong'], lat: 20.9373, lon: 106.3146 },
  { name: 'Hậu Giang', variants: ['hau giang', 'haugiang'], lat: 9.7844, lon: 105.4701 },
  { name: 'Hòa Bình', variants: ['hoa binh', 'hoabinh'], lat: 20.8136, lon: 105.3383 },
  { name: 'Hưng Yên', variants: ['hung yen', 'hungyen'], lat: 20.6464, lon: 106.0511 },
  { name: 'Khánh Hòa', variants: ['khanh hoa', 'khanhhoa', 'nha trang'], lat: 12.2388, lon: 109.1967 },
  { name: 'Kiên Giang', variants: ['kien giang', 'kiengiang', 'phu quoc'], lat: 9.9580, lon: 105.1234 },
  { name: 'Kon Tum', variants: ['kon tum', 'kontum'], lat: 14.3545, lon: 108.0076 },
  { name: 'Lai Châu', variants: ['lai chau', 'laichau'], lat: 22.3864, lon: 103.4703 },
  { name: 'Lâm Đồng', variants: ['lam dong', 'lamdong', 'da lat'], lat: 11.9404, lon: 108.4583 },
  { name: 'Lạng Sơn', variants: ['lang son', 'langson'], lat: 21.8537, lon: 106.7613 },
  { name: 'Lào Cai', variants: ['lao cai', 'laocai', 'sapa'], lat: 22.3402, lon: 103.8441 },
  { name: 'Long An', variants: ['long an', 'longan'], lat: 10.6086, lon: 106.6714 },
  { name: 'Nam Định', variants: ['nam dinh', 'namdinh'], lat: 20.4200, lon: 106.1780 },
  { name: 'Nghệ An', variants: ['nghe an', 'nghean', 'vinh'], lat: 18.6796, lon: 105.6813 },
  { name: 'Ninh Bình', variants: ['ninh binh', 'ninhbinh'], lat: 20.2506, lon: 105.9745 },
  { name: 'Ninh Thuận', variants: ['ninh thuan', 'ninhthuan'], lat: 11.5646, lon: 108.9886 },
  { name: 'Phú Thọ', variants: ['phu tho', 'phutho'], lat: 21.3223, lon: 105.4019 },
  { name: 'Phú Yên', variants: ['phu yen', 'phuyen'], lat: 13.0884, lon: 109.0929 },
  { name: 'Quảng Bình', variants: ['quang binh', 'quangbinh'], lat: 17.4687, lon: 106.6227 },
  { name: 'Quảng Nam', variants: ['quang nam', 'quangnam', 'hoi an'], lat: 15.8801, lon: 108.3380 },
  { name: 'Quảng Ngãi', variants: ['quang ngai', 'quangngai'], lat: 15.1167, lon: 108.8000 },
  { name: 'Quảng Ninh', variants: ['quang ninh', 'quangninh', 'ha long'], lat: 21.0064, lon: 107.2925 },
  { name: 'Quảng Trị', variants: ['quang tri', 'quangtri'], lat: 16.7500, lon: 107.2000 },
  { name: 'Sóc Trăng', variants: ['soc trang', 'soctrang'], lat: 9.6025, lon: 105.9739 },
  { name: 'Sơn La', variants: ['son la', 'sonla'], lat: 21.3257, lon: 103.9180 },
  { name: 'Tây Ninh', variants: ['tay ninh', 'tayninh'], lat: 11.3131, lon: 106.0963 },
  { name: 'Thái Bình', variants: ['thai binh', 'thaibinh'], lat: 20.4463, lon: 106.3366 },
  { name: 'Thái Nguyên', variants: ['thai nguyen', 'thainguyen'], lat: 21.5942, lon: 105.8482 },
  { name: 'Thanh Hóa', variants: ['thanh hoa', 'thanhhoa'], lat: 19.8067, lon: 105.7852 },
  { name: 'Thừa Thiên Huế', variants: ['thua thien hue', 'thuathienhue', 'hue'], lat: 16.4637, lon: 107.5909 },
  { name: 'Tiền Giang', variants: ['tien giang', 'tiengiang'], lat: 10.3600, lon: 106.3600 },
  { name: 'Trà Vinh', variants: ['tra vinh', 'travinh'], lat: 9.9347, lon: 106.3453 },
  { name: 'Tuyên Quang', variants: ['tuyen quang', 'tuyenquang'], lat: 21.8230, lon: 105.2142 },
  { name: 'Vĩnh Long', variants: ['vinh long', 'vinhlong'], lat: 10.2531, lon: 105.9752 },
  { name: 'Vĩnh Phúc', variants: ['vinh phuc', 'vinhphuc'], lat: 21.3609, lon: 105.5470 },
  { name: 'Yên Bái', variants: ['yen bai', 'yenbai'], lat: 21.7029, lon: 104.8720 },
];

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str: string): string {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\s+/g, ''); // Loại bỏ khoảng trắng
  return str;
}

// Tìm kiếm thành phố thông minh
export function searchCity(query: string): CityInfo[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = removeVietnameseTones(query.toLowerCase().trim());
  const results: CityInfo[] = [];

  for (const city of VIETNAM_CITIES) {
    // Kiểm tra tên gốc
    const normalizedName = removeVietnameseTones(city.name);
    if (normalizedName.includes(normalizedQuery)) {
      results.push(city);
      continue;
    }

    // Kiểm tra các biến thể
    for (const variant of city.variants) {
      const normalizedVariant = removeVietnameseTones(variant);
      if (normalizedVariant.includes(normalizedQuery)) {
        results.push(city);
        break;
      }
    }
  }

  return results;
}

// Lấy tên thành phố để hiển thị gợi ý
export function getCitySuggestions(query: string, limit: number = 5): string[] {
  const results = searchCity(query);
  return results.slice(0, limit).map(city => city.name);
}
