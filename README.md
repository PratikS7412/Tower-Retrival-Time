# Tower Parking System - Time Retrieval Calculator

A comprehensive web application for calculating and analyzing tower parking system retrieval times based on configurable parameters.

## Features

- **Dynamic Calculations**: Real-time calculation updates as parameters change
- **Multiple Tower Configurations**: Support for 0+1, 0+2, 0+3, 1+1, 1+2, 1+3, 2+2, 2+3, 3+3 configurations
- **Comprehensive Parameters**: Configurable lifting speeds, traversing speeds, distances, and time constants
- **Performance Analysis**: Visual indicators showing system efficiency and throughput
- **Detailed Breakdown**: Show/hide detailed calculation breakdown
- **Export Functionality**: Export results to CSV format
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Usage

1. **Configure Parameters**: Adjust system parameters in the left panel:
   - System speeds (lifting, traversing, turn table)
   - Distance parameters (traversing distances, pallet dimensions)
   - Time constants (door operations, processing times)
   - Tower configuration and capacity

2. **View Results**: Real-time results display shows:
   - Minimum, maximum, and average retrieval times
   - Total time required for all cars
   - System throughput in cars per hour
   - Performance indicators with visual feedback

3. **Detailed Analysis**: Toggle detailed breakdown to see:
   - Base time components
   - Movement time calculations
   - Step-by-step calculation process

4. **Export Data**: Export complete analysis to CSV for further processing

## Technical Details

### Calculation Methodology

The calculator uses the following formula structure:

```
Total Retrieval Time = Base Time + Lifting Time + Traversing Time + Rotation Time
```

Where:
- **Base Time**: Door operations + Processing + Additional times
- **Lifting Time**: Height / Lifting Speed (varies by level)
- **Traversing Time**: Distance / Traversing Speed
- **Rotation Time**: 180° / Turn Table Speed

### Tower Configuration Impact

Different tower configurations (0+1, 1+1, 2+2, etc.) apply complexity factors based on:
- Number of parking rows on each side
- Access pattern complexity
- Movement coordination requirements

### Performance Metrics

- **System Efficiency**: Based on average retrieval time (target: <3 minutes)
- **Throughput**: Calculated as cars per hour capacity
- **Performance Classification**: Good/Moderate/Poor based on industry standards

## File Structure

```
tower-parking-calculator/
├── index.html          # Main application interface
├── css/
│   └── styles.css      # Application styling
├── js/
│   └── calculator.js   # Main calculation engine
└── README.md           # This documentation
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Installation

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No additional dependencies or server setup required

## Customization

### Adding New Tower Configurations

Edit the `towerConfigurations` object in `calculator.js`:

```javascript
this.towerConfigurations = {
    "custom": [factor1, factor2, factor3, factor4, factor5, factor6, factor7],
    // Add new configurations here
};
```

### Modifying Default Parameters

Update the `defaultParams` object in `calculator.js`:

```javascript
this.defaultParams = {
    liftingSpeed: 60.0,      // m/min
    traversingSpeed: 20.0,   // m/min
    // Modify default values here
};
```

## License

MIT License - feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Note**: This calculator is based on typical tower parking system specifications and should be validated against manufacturer specifications for production use.