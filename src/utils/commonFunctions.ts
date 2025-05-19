export function string_to_slug(str: string): string {
    str = str.trim().toLowerCase();

    // Thay thế tiếng Việt có dấu thành không dấu
    const map: { [key: string]: string } = {
        á: 'a', à: 'a', ả: 'a', ã: 'a', ạ: 'a',
        ă: 'a', ắ: 'a', ằ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
        â: 'a', ấ: 'a', ầ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
        é: 'e', è: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
        ê: 'e', ế: 'e', ề: 'e', ể: 'e', ễ: 'e', ệ: 'e',
        í: 'i', ì: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
        ó: 'o', ò: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
        ô: 'o', ố: 'o', ồ: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
        ơ: 'o', ớ: 'o', ờ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
        ú: 'u', ù: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
        ư: 'u', ứ: 'u', ừ: 'u', ử: 'u', ữ: 'u', ự: 'u',
        ý: 'y', ỳ: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
        đ: 'd'
    };

    str = str.replace(/[^A-Za-z0-9\s-]/g, char => map[char] || ''); 

    str = str.replace(/[^a-z0-9\s-]/g, '') 
             .replace(/\s+/g, '-')         
             .replace(/-+/g, '-');        

    return str;
}
