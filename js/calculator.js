// Enhanced Tower Parking System Calculator
class TowerParkingCalculator {
    constructor() {
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

        // Combo checkbox listener
        document.getElementById('enableCombos').addEventListener('change', () => this.toggleComboInputs());
    }

    toggleComboInputs() {
        const combosCheckbox = document.getElementById('enableCombos');
        const comboInputs = document.getElementById('comboInputs');
        comboInputs.style.display = combosCheckbox.checked ? 'block' : 'none';
        this.calculate();
    }

    getInputValues() {
        return {
            levelsAbove: parseInt(document.getElementById('levelsAbove').value) || 0,
            levelsBelow: parseInt(document.getElementById('levelsBelow').value) || 0,
            aboveHeight1: parseFloat(document.getElementById('aboveHeight1').value) || 2100,
            enableCombos: document.getElementById('enableCombos').checked,
            aboveHeight2: parseFloat(document.getElementById('aboveHeight2').value) || 1900,
            aboveCount2: parseInt(document.getElementById('aboveCount2').value) || 0,
            aboveHeight3: parseFloat(document.getElementById('aboveHeight3').value) || 2200,
            aboveCount3: parseInt(document.getElementById('aboveCount3').value) || 0,
            belowHeight: parseFloat(document.getElementById('belowHeight').value) || 2000,
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
            numberOfCars: parseInt(document.getElementById('numberOfCars').value) || 70
        };
    }

    calculateLevelHeights(params) {
        let levelConfig = [];
        let totalAboveHeight = 0;
        let totalBelowHeight = 0;

        // Calculate above ground levels
        if (params.levelsAbove > 0) {
            if (params.enableCombos) {
                let remainingLevels = params.levelsAbove;

                // Combo 2
                if (params.aboveCount2 > 0 && remainingLevels > 0) {
                    const actualCount2 = Math.min(params.aboveCount2, remainingLevels);
                    levelConfig.push({
                        type: 'Above Ground - Combo 1',
                        height: params.aboveHeight2,
                        count: actualCount2,
                        totalHeight: params.aboveHeight2 * actualCount2
                    });
                    totalAboveHeight += params.aboveHeight2 * actualCount2;
                    remainingLevels -= actualCount2;
                }

                // Combo 3
                if (params.aboveCount3 > 0 && remainingLevels > 0) {
                    const actualCount3 = Math.min(params.aboveCount3, remainingLevels);
                    levelConfig.push({
                        type: 'Above Ground - Combo 2',
                        height: params.aboveHeight3,
                        count: actualCount3,
                        totalHeight: params.aboveHeight3 * actualCount3
                    });
                    totalAboveHeight += params.aboveHeight3 * actualCount3;
                    remainingLevels -= actualCount3;
                }

                // Remaining levels use default height
                if (remainingLevels > 0) {
                    levelConfig.push({
                        type: 'Above Ground - Default',
                        height: params.aboveHeight1,
                        count: remainingLevels,
                        totalHeight: params.aboveHeight1 * remainingLevels
                    });
                    totalAboveHeight += params.aboveHeight1 * remainingLevels;
                }
            } else {
                // Single height for all above ground levels
                levelConfig.push({
                    type: 'Above Ground',
                    height: params.aboveHeight1,
                    count: params.levelsAbove,
                    totalHeight: params.aboveHeight1 * params.levelsAbove
                });
                totalAboveHeight = params.aboveHeight1 * params.levelsAbove;
            }
        }

        // Calculate below ground levels
        if (params.levelsBelow > 0) {
            levelConfig.push({
                type: 'Below Ground',
                height: params.belowHeight,
                count: params.levelsBelow,
                totalHeight: params.belowHeight * params.levelsBelow
            });
            totalBelowHeight = params.belowHeight * params.levelsBelow;
        }

        return {
            levelConfig,
            totalAboveHeight,
            totalBelowHeight,
            totalHeight: totalAboveHeight + totalBelowHeight
        };
    }

    calculate() {
        try {
            const params = this.getInputValues();
            const levelData = this.calculateLevelHeights(params);

            // Convert speeds to m/s
            const liftingSpeedMs = params.liftingSpeed / 60.0;
            const traversingSpeedMs = params.traversingSpeed / 60.0;

            // Calculate base times
            const baseTime = params.doorTime + params.processingTime + 
                           params.additionalTime + params.liftingAddTime + params.traversingAddTime;

            // Calculate traversing times
            const traversingTime1 = (params.traversingDistance1 / 1000.0) / traversingSpeedMs;
            const traversingTime2 = (params.traversingDistance2 / 1000.0) / traversingSpeedMs;
            const avgTraversingTime = (traversingTime1 + traversingTime2) / 2;

            // Calculate rotation time (180 degrees)
            const rotationTime = (180.0 / 360.0) / (params.turnTableSpeed / 60.0);

            // Calculate lifting time based on total height
            const totalLiftingTime = (levelData.totalHeight / 1000.0) / liftingSpeedMs;

            // Apply tower configuration factors
            const configFactors = this.towerConfigurations[params.towerType] || [0, 0, 1, 0, 1, 0, 0];
            const complexityFactor = 1 + (configFactors.reduce((a, b) => a + b, 0) * 0.1);

            // Calculate final times
            const minTime = baseTime + (totalLiftingTime * 0.1) + avgTraversingTime + rotationTime; // Minimum assumes shortest route
            const maxTime = (baseTime + totalLiftingTime + avgTraversingTime + rotationTime) * complexityFactor;
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
                totalLiftingTime,
                avgTraversingTime,
                rotationTime,
                totalHeight: levelData.totalHeight
            });

            this.updateLevelSummary(levelData);

        } catch (error) {
            console.error('Calculation error:', error);
        }
    }

    updateResults(results) {
        // Update main results
        this.updateElement('minTimeSeconds', results.minTime.toFixed(1));
        this.updateElement('minTimeMinutes', (results.minTime / 60).toFixed(2));

        this.updateElement('maxTimeSeconds', results.maxTime.toFixed(1));
        this.updateElement('maxTimeMinutes', (results.maxTime / 60).toFixed(2));

        this.updateElement('avgTimeSeconds', results.avgTime.toFixed(1));
        this.updateElement('avgTimeMinutes', (results.avgTime / 60).toFixed(2));

        this.updateElement('totalTimeHours', results.totalTimeHours.toFixed(1));
        this.updateElement('totalTimeMinutes', (results.totalTimeSeconds / 60).toFixed(0));

        this.updateElement('throughputPerHour', results.carsPerHour.toFixed(1));
        this.updateElement('throughputPercent', results.throughputPercent.toFixed(1));

        // Update performance indicators
        this.updatePerformanceIndicators(results);

        // Update breakdown details
        this.updateBreakdown(results);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateLevelSummary(levelData) {
        const summaryElement = document.getElementById('levelSummary');
        if (!summaryElement) return;

        let summaryHTML = '<div class="level-summary-content">';

        levelData.levelConfig.forEach((config, index) => {
            summaryHTML += `
                <div class="summary-row">
                    <span class="summary-type">${config.type}:</span>
                    <span class="summary-details">
                        ${config.count} levels × ${config.height}mm = ${config.totalHeight.toLocaleString()}mm
                    </span>
                </div>
            `;
        });

        summaryHTML += `
            <div class="summary-total">
                <strong>Total Height: ${levelData.totalHeight.toLocaleString()}mm (${(levelData.totalHeight/1000).toFixed(1)}m)</strong>
            </div>
        </div>
        `;

        summaryElement.innerHTML = summaryHTML;
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
        this.updateIndicator('efficiencyIndicator', 'efficiencyFill', 'efficiencyValue', 
                           efficiencyClass, efficiencyPercent, `${efficiencyPercent.toFixed(0)}%`);

        // Update speed indicator
        this.updateIndicator('speedIndicator', 'speedFill', 'speedValue', 
                           speedClass, speedPercent, `${results.carsPerHour.toFixed(1)} cars/hour`);
    }

    updateIndicator(indicatorId, fillId, valueId, className, percentage, valueText) {
        const indicator = document.getElementById(indicatorId);
        const fill = document.getElementById(fillId);
        const value = document.getElementById(valueId);

        if (indicator) indicator.className = `indicator ${className}`;
        if (fill) fill.style.width = `${percentage}%`;
        if (value) value.textContent = valueText;
    }

    updateBreakdown(results) {
        this.updateElement('breakdownDoorTime', `${document.getElementById('doorTime').value} s`);
        this.updateElement('breakdownProcessingTime', `${document.getElementById('processingTime').value} s`);
        this.updateElement('breakdownAdditionalTime', `${document.getElementById('additionalTime').value} s`);
        this.updateElement('breakdownTotalHeight', `${(results.totalHeight/1000).toFixed(1)} m`);
        this.updateElement('breakdownLiftingTime', `${results.totalLiftingTime.toFixed(1)} s`);
        this.updateElement('breakdownTraversingTime', `${results.avgTraversingTime.toFixed(1)} s`);
        this.updateElement('breakdownRotationTime', `${results.rotationTime.toFixed(1)} s`);
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
            location.reload();
        }
    }

    exportResults() {
        try {
            const params = this.getInputValues();
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

            // Get current results
            const minTime = parseFloat(document.getElementById('minTimeSeconds').textContent || '0');
            const maxTime = parseFloat(document.getElementById('maxTimeSeconds').textContent || '0');
            const avgTime = parseFloat(document.getElementById('avgTimeSeconds').textContent || '0');
            const totalTime = parseFloat(document.getElementById('totalTimeHours').textContent || '0');
            const throughput = parseFloat(document.getElementById('throughputPerHour').textContent || '0');

            const csvContent = [
                ['Tower Parking System - Enhanced Time Retrieval Analysis'],
                [`Generated: ${new Date().toLocaleString()}`],
                [''],
                ['Level Configuration'],
                ['Levels Above Ground', params.levelsAbove],
                ['Levels Below Ground', params.levelsBelow],
                ['Above Ground Height 1', params.aboveHeight1, 'mm'],
                ['Enable Combinations', params.enableCombos],
                ['Below Ground Height', params.belowHeight, 'mm'],
                [''],
                ['System Parameters'],
                ['Lifting Speed', params.liftingSpeed, 'm/min'],
                ['Traversing Speed', params.traversingSpeed, 'm/min'],
                ['Turn Table Speed', params.turnTableSpeed, 'RPM'],
                ['Tower Type', params.towerType],
                ['Number of Cars', params.numberOfCars],
                [''],
                ['Results'],
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
            link.download = `tower-parking-enhanced-${timestamp}.csv`;
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