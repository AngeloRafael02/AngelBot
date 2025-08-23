export interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        wind_kph: number;
        pressure_mb: number;
    };
}
