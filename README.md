# Split Flap Ticker

The Split Flap Ticker is a web application that simulates a split-flap display, commonly seen in old train stations and airports. This project displays real-time cryptocurrency and stock prices using a visually appealing split-flap animation.

## Features

- **Real-time Data**: Fetches live cryptocurrency and stock prices using the CoinGecko and Alpha Vantage APIs.
- **Demo Mode**: Uses mock data for development and testing purposes.
- **Sound Effects**: Optional sound effects to enhance the user experience.
- **Responsive Design**: Works on various screen sizes.

## Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/split-flap-ticker.git
   cd split-flap-ticker
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   - Create a `.env` file in the `split-flap-ticker` directory.
   - Add your API keys and any other environment variables:
     ```
     REACT_APP_USE_REAL_API=true
     ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
     COINGECKO_API_KEY=your_coingecko_api_key
     ```

4. **Run the Application**:

   ```bash
   npm start
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

- **Development Mode**: By default, the application runs in development mode using mock data. To use real API data, set `REACT_APP_USE_REAL_API` to `true` in your `.env` file.
- **Sound Effects**: Enable sound effects by clicking the "Enable Sound" button in the application.

## Project Structure

- **`src/`**: Contains the main application code.
  - **`components/`**: Contains the `SplitFlapDisplay` component and its styles.
  - **`App.js`**: Main application file.
  - **`App.css`**: Main stylesheet.
- **`public/`**: Contains static files like `index.html` and sound files.

## Contributing

Founding developers are ashley@seeking-satoshi.info and cody@seeking-satoshi.info

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- CoinGecko for cryptocurrency data.
- Alpha Vantage for stock market data.
