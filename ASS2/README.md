# Weather App - Assignment 2

Ứng dụng thời tiết đơn giản sử dụng React Native và Expo.

## Tính năng

- Tìm kiếm thời tiết theo tên thành phố
- Gợi ý thành phố phổ biến
- Nhận diện thông minh tên thành phố (không dấu, không khoảng trắng)
- Hiển thị thông tin thời tiết chi tiết
- Xử lý lỗi khi không tìm thấy thành phố hoặc mất kết nối Internet
- Lịch sử tìm kiếm gần đây

## Cài đặt

1. Cài đặt dependencies

   ```bash
   npm install
   ```

2. Tạo file `.env` trong thư mục gốc của project:

   ```env
   WEATHER_API_URL=https://api.openweathermap.org/data/2.5
   WEATHER_API_KEY=your_api_key_here
   ```

   **Lưu ý:** Bạn cần đăng ký API key miễn phí tại [OpenWeatherMap](https://openweathermap.org/api) và thay thế `your_api_key_here` bằng API key của bạn.

3. Khởi động ứng dụng

   ```bash
   npx expo start
   ```

   Sau đó chọn một trong các tùy chọn:
   - Nhấn `a` để mở trên Android emulator
   - Nhấn `i` để mở trên iOS simulator
   - Quét QR code bằng Expo Go app trên điện thoại

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
