# Weather App - Asm2_SE171793_WeatherApp

Ứng dụng thời tiết đơn giản được xây dựng với React Native và Expo.

## Tính năng

- 🔍 Tìm kiếm thời tiết theo tên thành phố
- 🎯 Gợi ý thông minh cho các tỉnh thành Việt Nam
- 📱 Hỗ trợ tìm kiếm không dấu, không khoảng trắng
- 📊 Hiển thị thông tin thời tiết chi tiết
- 🌐 Xử lý lỗi khi không có kết nối Internet

## Cài đặt

1. Cài đặt dependencies

   ```bash
   npm install
   ```

2. Cấu hình API Key

   - Tạo file `.env` trong thư mục gốc của project
   - Thêm API key từ OpenWeatherMap:
     ```
     EXPO_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
     EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
     ```
   - Lấy API key miễn phí tại: https://openweathermap.org/api

3. Khởi chạy ứng dụng

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

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
