# Tower Parking System - Enhanced Time Retrieval Calculator

A comprehensive web application for calculating and analyzing tower parking system retrieval times with advanced level configuration options.

## NEW FEATURES - Enhanced Level Configuration

### Above/Below Ground Separation
- **Levels Above Ground**: Specify exact number of levels above ground
- **Levels Below Ground**: Specify exact number of levels below ground
- **Individual Height Control**: Different heights for above and below ground levels

### Multiple Height Combinations (Above Ground)
- **Single Height Mode**: Use one height for all above ground levels
- **Multiple Height Mode**: Enable up to 3 different height combinations
  - Specify height and number of levels for each combination
  - Remaining levels automatically use default height
  - Visual summary shows exact distribution

### Enhanced Calculations
- **Accurate Height Totals**: Sum of all individual level heights
- **Flexible Configuration**: Supports complex building designs
- **Real-time Updates**: Level summary updates as you change parameters

## Key Features

- **Dynamic Level Configuration**: Separate above/below ground with multiple height options
- **Real-time Calculations**: Updates instantly as parameters change
- **Visual Level Summary**: Shows breakdown of level configurations
- **Multiple Tower Types**: Support for 0+1 through 3+3 configurations
- **Performance Analysis**: Visual indicators for system efficiency
- **Export Functionality**: Export complete analysis to CSV
- **Responsive Design**: Works on all device sizes

## Usage

### Level Configuration
1. **Set Level Counts**: Enter number of above and below ground levels
2. **Configure Heights**: 
   - Set default above ground height
   - Optionally enable multiple height combinations
   - Set below ground height
3. **Review Summary**: Check the automatic level configuration summary

### Height Combinations
When "Enable multiple height combinations" is checked:
- **Combination 1**: Set height and number of levels
- **Combination 2**: Set height and number of levels  
- **Remaining Levels**: Automatically use default height

Example:
- 25 levels above ground
- Combination 1: 1900mm for 10 levels
- Combination 2: 2200mm for 5 levels
- Remaining 10 levels: 2100mm (default)

### System Parameters
Configure mechanical system parameters:
- Lifting speed, traversing speed, turn table speed
- Distance parameters and time constants
- Tower configuration and car capacity

### Results Analysis
- **Retrieval Times**: Min, max, and average times
- **Performance Metrics**: Efficiency and throughput indicators
- **Level Summary**: Visual breakdown of configuration
- **Detailed Breakdown**: Step-by-step calculation display

## Technical Implementation

### Enhanced Calculation Logic
```javascript
// Above ground calculation with combinations
if (enableCombinations) {
    totalHeight = (height1 × count1) + (height2 × count2) + (defaultHeight × remainingLevels)
} else {
    totalHeight = defaultHeight × totalLevels
}

// Below ground calculation
belowGroundHeight = belowHeight × belowLevels

// Total lifting height
totalLiftingHeight = totalAboveHeight + totalBelowHeight
```

### Level Configuration Validation
- Automatic level count validation
- Height combination overflow handling
- Real-time summary updates
- Input validation and error handling

## File Structure

```
tower-parking-calculator-enhanced/
├── index.html              # Enhanced UI with level configuration
├── css/
│   └── styles.css          # Enhanced styling with level summary
├── js/
│   └── calculator.js       # Enhanced calculation engine
└── README.md               # This documentation
```

## Installation & Deployment

### Local Development
1. Download and extract the project files
2. Open `index.html` in a web browser
3. No server setup required - runs entirely client-side

### GitHub Pages Deployment
1. Create new repository on GitHub
2. Upload all project files
3. Enable GitHub Pages in repository settings
4. Access at `https://yourusername.github.io/repository-name`

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Customization Examples

### Adding New Tower Configurations
```javascript
this.towerConfigurations = {
    "4+4": [4.0, 4.0, 2.0, 1.0, 2.0, 4.0, 4.0],
    // Add custom configurations
};
```

### Modifying Default Level Heights
```javascript
// In calculator.js - modify default values
aboveHeight1: 2100,  // Default above ground height (mm)
belowHeight: 2000,   // Default below ground height (mm)
```

## Performance Optimization

The enhanced calculator includes:
- **Efficient Calculations**: Optimized height summation algorithms
- **Real-time Updates**: Debounced input handling
- **Memory Management**: Efficient DOM updates
- **Error Handling**: Robust input validation

## Export Features

Enhanced CSV export includes:
- Complete level configuration breakdown
- Height combination details
- Total height calculations
- Performance metrics
- System parameters

## Support & Contributing

For issues, questions, or contributions:
1. Check existing issues in the repository
2. Create detailed bug reports with configuration details
3. Include level configuration when reporting calculation issues
4. Test with multiple tower types before submitting

---

**Version**: 2.0 - Enhanced Level Configuration  
**License**: MIT  
**Compatibility**: Modern web browsers with ES6 support
