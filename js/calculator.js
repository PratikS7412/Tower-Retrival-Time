// Tower Parking System Calculator
class TowerParkingCalculator {
    constructor() {
        this.defaultParams = {
            liftingSpeed: 60.0,
            traversingSpeed: 20.0,
            turnTableSpeed: 2.2,
            traversingDistance1: 2270.0,
            traversingDistance2: 2370.0,
            palletInner: 2000.0,
            doorOpeningClosingTime: 20.0,
            additionalTime: 20.0,
            processingTime: 20.0,
            liftingAddTime: 12.0,
            traversingAddTime: 5.0,
            numberOfCars: 70,
            numberOfLevels: 25,
            firstLevelHeight: 2550,
            regularLevelHeight: 2100
        };

        this.towerConfigurations = {
            "0+1": [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
            "0+2": [0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 0.0],
            "0+3": [0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0],
            "1+1": [0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
            "1+2": [0.0, 0.0, 1.0, 0.0, 1.0, 2.0, 0.0],
            "1+3": [0.0, 0.0, 1.0, 0.0, 1.0, 2.0, 3.0],
            "2+2": [0.0, 2.0, 1.0, 0.0, 1.0, 2.0, 0.0],
            "2+3": [0.0, 2.0, 1.0, 0.0, 1.0, 2.0, 3.0],
            "3+3": [3.0, 2.0, 1.0, 0.0, 1.0, 2.0, 3.0]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDefaults();
        this.calculate();
    }

    setupEventListeners() {
        // Input change listeners
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });

        // Button listeners
        document.getElementById('resetBtn').addEventListener('click', () => this.resetToDefaults());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportResults());
        document.getElementById('toggleBreakdown').addEventListener('click', () => this.toggleBreakdown());
    }

    loadDefaults() {
        const elementMap = {
            liftingSpeed: 'liftingSpeed',
            traversingSpeed: 'traversingSpeed',
            turnTableSpeed: 'turnTableSpeed',
            traversingDistance1: 'traversingDistance1',
            traversingDistance2: 'traversingDistance2',
            palletInner: 'palletInner',
            doorOpeningClosingTime: 'doorTime',
            additionalTime: 'additionalTime',
            processingTime: 'processingTime',
            liftingAddTime: 'liftingAddTime',
            traversingAddTime: 'traversingAddTime',
            numberOfCars: 'numberOfCars',
            numberOfLevels: 'numberOfLevels',
            firstLevelHeight: 'firstLevelHeight',
            regularLevelHeight: 'levelHeight'
        };

        Object.keys(this.defaultParams).forEach(param => {
            const elementId = elementMap[param];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = this.defaultParams[param];
                }
            }
        });
    }

    getInputValues() {
        return {
            liftingSpeed: parseFloat(document.getElementById('liftingSpeed').value) || 60,
            traversingSpeed: parseFloat(document.getElementById('traversingSpeed').value) || 20,
            turnTableSpeed: parseFloat(document.getElementById('turnTableSpeed').value) || 2.2,
            traversingDistance1: parseFloat(document.getElementById('traversingDistance1').value) || 2270,
            traversingDistance2: parseFloat(document.getElementById('traversingDistance2').value) || 2370,
            palletInner: parseFloat(document.getElementById('palletInner').value) || 2000,
            doorTime: parseFloat(document.getElementById('doorTime').value) || 20,
            additionalTime: parseFloat(document.getElementById('additionalTime').value) || 20,
            processingTime: parseFloat(document.getElementById('processingTime').value) || 20,
            liftingAddTime: parseFloat(document.getElementById('liftingAddTime').value) || 12,
            traversingAddTime: parseFloat(document.getElementById('traversingAddTime').value) || 5,
            towerType: document.getElementById('towerType').value || '1+1',
            numberOfCars: parseInt(document.getElementById('numberOfCars').value) || 70,
            numberOfLevels: parseInt(document.getElementById('numberOfLevels').value) || 25,
            firstLevelHeight: parseFloat(document.getElementById('firstLevelHeight').value) || 2550,
            levelHeight: parseFloat(document.getElementById('levelHeight').value) || 2100
        };
    }

    calculate() {
        try {
            const params = this.getInputValues();

            // Convert units
            const liftingSpeedMs = params.liftingSpeed / 60.0; // m/s
            const traversingSpeedMs = params.traversingSpeed / 60.0; // m/s

            // Calculate base times
            const baseTime = params.doorTime + params.processingTime + 
                           params.additionalTime + params.liftingAddTime + params.traversingAddTime;

            // Calculate traversing times
            const traversingTime1 = (params.traversingDistance1 / 1000.0) / traversingSpeedMs;
            const traversingTime2 = (params.traversingDistance2 / 1000.0) / traversingSpeedMs;
            const avgTraversingTime = (traversingTime1 + traversingTime2) / 2;

            // Calculate rotation time (180 degrees)
            const rotationTime = (180.0 / 360.0) / (params.turnTableSpeed / 60.0);

            // Calculate lifting times for different levels
            const groundLevel = 0;
            const firstLevel = params.firstLevelHeight / 1000.0; // Convert to meters
            const maxLevel = firstLevel + ((params.numberOfLevels - 1) * params.levelHeight / 1000.0);

            const minLiftingTime = groundLevel / liftingSpeedMs;
            const maxLiftingTime = maxLevel / liftingSpeedMs;
            const avgLiftingTime = (minLiftingTime + maxLiftingTime) / 2;

            // Apply tower configuration factors
            const configFactors = this.towerConfigurations[params.towerType] || [0, 0, 1, 0, 1, 0, 0];
            const complexityFactor = 1 + (configFactors.reduce((a, b) => a + b, 0) * 0.1);

            // Calculate final times
            const minTime = baseTime + minLiftingTime + avgTraversingTime + rotationTime;
            const maxTime = (baseTime + maxLiftingTime + avgTraversingTime + rotationTime) * complexityFactor;
            const avgTime = (minTime + maxTime) / 2;

            // Calculate total times
            const totalTimeSeconds = avgTime * params.numberOfCars;
            const totalTimeHours = totalTimeSeconds / 3600;

            // Calculate throughput
            const carsPerHour = 3600 / avgTime;
            const throughputPercent = (carsPerHour / params.numberOfCars) * 100;

            // Update display
            this.updateResults({
                minTime,
                maxTime,
                avgTime,
                totalTimeSeconds,
                totalTimeHours,
                carsPerHour,
                throughputPercent,
                baseTime,
                maxLiftingTime,
                avgTraversingTime,
                rotationTime
            });

        } catch (error) {
            console.error('Calculation error:', error);
        }
    }

    updateResults(results) {
        // Main results
        document.getElementById('minTimeSeconds').textContent = results.minTime.toFixed(1);
        document.getElementById('minTimeMinutes').textContent = (results.minTime / 60).toFixed(2);

        document.getElementById('maxTimeSeconds').textContent = results.maxTime.toFixed(1);
        document.getElementById('maxTimeMinutes').textContent = (results.maxTime / 60).toFixed(2);

        document.getElementById('avgTimeSeconds').textContent = results.avgTime.toFixed(1);
        document.getElementById('avgTimeMinutes').textContent = (results.avgTime / 60).toFixed(2);

        document.getElementById('totalTimeHours').textContent = results.totalTimeHours.toFixed(1);
        document.getElementById('totalTimeMinutes').textContent = (results.totalTimeSeconds / 60).toFixed(0);

        document.getElementById('throughputPerHour').textContent = results.carsPerHour.toFixed(1);
        document.getElementById('throughputPercent').textContent = results.throughputPercent.toFixed(1);

        // Performance indicators
        this.updatePerformanceIndicators(results);

        // Breakdown details
        this.updateBreakdown(results);
    }

    updatePerformanceIndicators(results) {
        // Efficiency based on average time (good: <3min, moderate: 3-5min, poor: >5min)
        const avgTimeMinutes = results.avgTime / 60;
        let efficiencyPercent, efficiencyClass;

        if (avgTimeMinutes <= 3) {
            efficiencyPercent = 100 - (avgTimeMinutes / 3 * 30);
            efficiencyClass = 'performance-good';
        } else if (avgTimeMinutes <= 5) {
            efficiencyPercent = 70 - ((avgTimeMinutes - 3) / 2 * 40);
            efficiencyClass = 'performance-moderate';
        } else {
            efficiencyPercent = Math.max(30 - (avgTimeMinutes - 5) * 5, 0);
            efficiencyClass = 'performance-poor';
        }

        // Speed based on throughput
        const speedPercent = Math.min(results.throughputPercent, 100);
        const speedClass = speedPercent > 50 ? 'performance-good' : 
                          speedPercent > 25 ? 'performance-moderate' : 'performance-poor';

        // Update efficiency indicator
        const efficiencyIndicator = document.getElementById('efficiencyIndicator');
        const efficiencyFill = document.getElementById('efficiencyFill');
        const efficiencyValue = document.getElementById('efficiencyValue');

        efficiencyIndicator.className = `indicator ${efficiencyClass}`;
        efficiencyFill.style.width = `${efficiencyPercent}%`;
        efficiencyValue.textContent = `${efficiencyPercent.toFixed(0)}%`;

        // Update speed indicator
        const speedIndicator = document.getElementById('speedIndicator');
        const speedFill = document.getElementById('speedFill');
        const speedValue = document.getElementById('speedValue');

        speedIndicator.className = `indicator ${speedClass}`;
        speedFill.style.width = `${speedPercent}%`;
        speedValue.textContent = `${results.carsPerHour.toFixed(1)} cars/hour`;
    }

    updateBreakdown(results) {
        document.getElementById('breakdownDoorTime').textContent = `${document.getElementById('doorTime').value} s`;
        document.getElementById('breakdownProcessingTime').textContent = `${document.getElementById('processingTime').value} s`;
        document.getElementById('breakdownAdditionalTime').textContent = `${document.getElementById('additionalTime').value} s`;
        document.getElementById('breakdownLiftingTime').textContent = `${results.maxLiftingTime.toFixed(1)} s`;
        document.getElementById('breakdownTraversingTime').textContent = `${results.avgTraversingTime.toFixed(1)} s`;
        document.getElementById('breakdownRotationTime').textContent = `${results.rotationTime.toFixed(1)} s`;
    }

    toggleBreakdown() {
        const breakdownCard = document.getElementById('breakdownCard');
        const toggleBtn = document.getElementById('toggleBreakdown');

        if (breakdownCard.style.display === 'none') {
            breakdownCard.style.display = 'block';
            toggleBtn.textContent = 'Hide Details';
        } else {
            breakdownCard.style.display = 'none';
            toggleBtn.textContent = 'Show Details';
        }
    }

    resetToDefaults() {
        if (confirm('Reset all parameters to default values?')) {
            this.loadDefaults();
            document.getElementById('towerType').value = '1+1';
            this.calculate();
        }
    }

    exportResults() {
        try {
            const params = this.getInputValues();
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

            // Get current results
            const minTime = parseFloat(document.getElementById('minTimeSeconds').textContent);
            const maxTime = parseFloat(document.getElementById('maxTimeSeconds').textContent);
            const avgTime = parseFloat(document.getElementById('avgTimeSeconds').textContent);
            const totalTime = parseFloat(document.getElementById('totalTimeHours').textContent);
            const throughput = parseFloat(document.getElementById('throughputPerHour').textContent);

            const csvContent = [
                ['Tower Parking System - Time Retrieval Analysis'],
                [`Generated: ${new Date().toLocaleString()}`],
                [''],
                ['Configuration Parameters'],
                ['Parameter', 'Value', 'Unit'],
                ['Lifting Speed', params.liftingSpeed, 'm/min'],
                ['Traversing Speed', params.traversingSpeed, 'm/min'],
                ['Turn Table Speed', params.turnTableSpeed, 'RPM'],
                ['Traversing Distance 1', params.traversingDistance1, 'mm'],
                ['Traversing Distance 2', params.traversingDistance2, 'mm'],
                ['Tower Type', params.towerType, ''],
                ['Number of Cars', params.numberOfCars, ''],
                ['Number of Levels', params.numberOfLevels, ''],
                [''],
                ['Calculation Results'],
                ['Metric', 'Value', 'Unit'],
                ['Minimum Retrieval Time', minTime.toFixed(2), 'seconds'],
                ['Maximum Retrieval Time', maxTime.toFixed(2), 'seconds'],
                ['Average Retrieval Time', avgTime.toFixed(2), 'seconds'],
                ['Total Time for All Cars', totalTime.toFixed(2), 'hours'],
                ['System Throughput', throughput.toFixed(2), 'cars/hour']
            ];

            const csvString = csvContent.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `tower-parking-analysis-${timestamp}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting results. Please try again.');
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TowerParkingCalculator();
});