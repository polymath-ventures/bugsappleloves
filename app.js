/**
 * Apple Joke Bugs - Formula Engine & Renderer
 * With editable values for user customization
 */

// ========== State Management ==========

let constants = null;
let originalBugs = null;
let currentBugs = null;

// ========== Data Loading ==========

async function loadData() {
    const [constantsRes, bugsRes] = await Promise.all([
        fetch('data/constants.json'),
        fetch('data/bugs.json')
    ]);

    constants = await constantsRes.json();
    const bugsData = await bugsRes.json();
    originalBugs = JSON.parse(JSON.stringify(bugsData.bugs)); // Deep clone for reset
    currentBugs = bugsData.bugs;

    return { constants, bugs: currentBugs };
}

// ========== Formula Engine ==========

class FormulaEngine {
    constructor(constants) {
        this.constants = constants;
        this.platformUsers = constants.platformUsers;
        this.appleFacts = constants.appleFacts;
    }

    calculateAffectedUsers(bug) {
        const { platforms, scope } = bug;
        let totalUsers = 0;
        const breakdown = {};

        for (const platform of platforms) {
            if (this.platformUsers[platform]) {
                const platformTotal = this.platformUsers[platform].count;
                const affected = Math.round(
                    platformTotal * scope.featureUsageRate * scope.bugEncounterRate
                );
                breakdown[platform] = {
                    total: platformTotal,
                    affected,
                    symbol: this.platformUsers[platform].symbol
                };
                totalUsers += affected;
            }
        }

        return { totalUsers, breakdown };
    }

    calculateTimePerIncident(bug) {
        const { behavioralFlow } = bug;
        let totalSeconds = 0;
        const stepBreakdown = [];

        for (const step of behavioralFlow.steps) {
            const stepTime = step.seconds * step.retries;
            totalSeconds += stepTime;
            stepBreakdown.push({
                ...step,
                effectiveSeconds: stepTime
            });
        }

        return { totalSeconds, stepBreakdown };
    }

    calculatePowerUserTax(bug, affectedUsers) {
        const { powerUserTax } = bug;
        let dailyTaxSeconds = 0;
        const taxBreakdown = [];

        for (const sink of powerUserTax.sinks) {
            const dailyPerUser = (sink.seconds * sink.participation) / sink.frequencyDays;
            const dailyTotal = dailyPerUser * affectedUsers;
            dailyTaxSeconds += dailyTotal;

            taxBreakdown.push({
                ...sink,
                dailySecondsPerUser: dailyPerUser,
                dailyTotalSeconds: dailyTotal
            });
        }

        return { dailyTaxSeconds, taxBreakdown };
    }

    calculateYearsUnfixed(bug) {
        const reportedDate = new Date(bug.reportedDate);
        const now = new Date();
        const diffMs = now - reportedDate;
        const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        return Math.round(diffYears * 10) / 10;
    }

    calculateImpact(bug) {
        const { totalUsers, breakdown: userBreakdown } = this.calculateAffectedUsers(bug);
        const { totalSeconds: secondsPerIncident, stepBreakdown } = this.calculateTimePerIncident(bug);
        const dailyBaseSeconds = totalUsers * bug.scope.frequencyPerDay * secondsPerIncident;
        const { dailyTaxSeconds, taxBreakdown } = this.calculatePowerUserTax(bug, totalUsers);
        const dailyTotalSeconds = dailyBaseSeconds + dailyTaxSeconds;
        const yearsUnfixed = this.calculateYearsUnfixed(bug);
        const pressureFactor = bug.shameFactors.pressureFactor;
        const shameMultiplier = 1 + (Math.sqrt(yearsUnfixed) * (pressureFactor - 1));
        const adjustedDailySeconds = dailyTotalSeconds * shameMultiplier;
        const dailyHours = adjustedDailySeconds / 3600;
        const dailyYears = dailyHours / (24 * 365.25);
        const annualHours = dailyHours * 365;
        const annualYears = dailyYears * 365;
        const daysSinceReported = yearsUnfixed * 365.25;
        const totalHoursSinceReported = dailyHours * daysSinceReported;
        const totalYearsSinceReported = dailyYears * daysSinceReported;
        const engHoursToFix = bug.engineeringEstimate.hoursToFix;
        const hourlyWage = 30;
        const annualCostToHumanity = annualHours * hourlyWage;
        const engSalary = this.appleFacts.engineerSalary.value;
        const engineersPayable = annualCostToHumanity / engSalary;

        return {
            affectedUsers: totalUsers,
            userBreakdown,
            secondsPerIncident,
            stepBreakdown,
            dailyTaxSeconds,
            taxBreakdown,
            dailyBaseSeconds,
            dailyTotalSeconds,
            shameMultiplier,
            adjustedDailySeconds,
            dailyHours,
            dailyYears,
            annualHours,
            annualYears,
            yearsUnfixed,
            totalHoursSinceReported,
            totalYearsSinceReported,
            pressureFactor,
            engHoursToFix,
            engineersPayable,
            annualCostToHumanity
        };
    }
}

// ========== Formatters ==========

function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
}

function formatNumberShort(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(0) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(0) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
    return num.toString();
}

function formatTime(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    return `${(seconds / 86400).toFixed(1)} days`;
}

function formatYears(years) {
    if (years < 1) {
        const days = years * 365.25;
        if (days < 1) {
            const hours = days * 24;
            return `${formatNumber(Math.round(hours))} hours`;
        }
        return `${formatNumber(Math.round(days))} days`;
    }
    if (years < 100) return `${years.toFixed(1)} years`;
    if (years < 1000) return `${Math.round(years)} years`;
    return `${formatNumber(Math.round(years))} years`;
}

function formatMoney(dollars) {
    if (dollars >= 1e12) return '$' + (dollars / 1e12).toFixed(1) + ' trillion';
    if (dollars >= 1e9) return '$' + (dollars / 1e9).toFixed(1) + ' billion';
    if (dollars >= 1e6) return '$' + (dollars / 1e6).toFixed(1) + ' million';
    return '$' + dollars.toLocaleString();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatPercent(decimal) {
    return (decimal * 100).toFixed(0) + '%';
}

// ========== Editable Value Helper ==========

function createEditable(value, bugIndex, path, type = 'number') {
    const displayValue = type === 'percent' ? formatPercent(value) :
                         type === 'seconds' ? value + 's' :
                         type === 'frequency' ? value.toFixed(1) :
                         type === 'users' ? formatNumberShort(value) :
                         value;

    return `<span class="editable"
                  data-bug="${bugIndex}"
                  data-path="${path}"
                  data-type="${type}"
                  data-value="${value}"
                  title="Click to edit">${displayValue}</span>`;
}

// ========== Event Handlers ==========

function handleEditableClick(e) {
    const target = e.target;
    if (!target.classList.contains('editable')) return;

    const currentValue = target.dataset.value;
    const type = target.dataset.type;

    // Create input
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'editable-input';
    input.value = type === 'percent' ? (parseFloat(currentValue) * 100) : currentValue;
    input.step = type === 'percent' ? '1' : type === 'frequency' ? '0.1' : '1';

    // Replace span with input
    target.replaceWith(input);
    input.focus();
    input.select();

    // Handle blur/enter
    const finishEdit = () => {
        let newValue = parseFloat(input.value);
        if (type === 'percent') newValue = newValue / 100;

        if (isNaN(newValue) || newValue < 0) {
            newValue = parseFloat(currentValue);
        }

        // Update the bug data
        const bugIndex = parseInt(target.dataset.bug);
        const path = target.dataset.path;
        updateBugValue(bugIndex, path, newValue);

        // Re-render
        renderAll();
    };

    input.addEventListener('blur', finishEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            input.value = currentValue;
            input.blur();
        }
    });
}

function updateBugValue(bugIndex, path, value) {
    const parts = path.split('.');
    let obj = currentBugs[bugIndex];

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // Handle array notation like steps[0]
        const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
        if (arrayMatch) {
            obj = obj[arrayMatch[1]][parseInt(arrayMatch[2])];
        } else {
            obj = obj[part];
        }
    }

    const lastPart = parts[parts.length - 1];
    const arrayMatch = lastPart.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
        obj[arrayMatch[1]][parseInt(arrayMatch[2])] = value;
    } else {
        obj[lastPart] = value;
    }
}

function resetBug(bugIndex) {
    currentBugs[bugIndex] = JSON.parse(JSON.stringify(originalBugs[bugIndex]));
    renderAll();
}

function resetAll() {
    currentBugs = JSON.parse(JSON.stringify(originalBugs));
    renderAll();
}

// ========== Renderer ==========

function renderBugCard(bug, impact, index) {
    const card = document.createElement('article');
    card.className = 'bug-card';
    card.id = `bug-${bug.id}`;

    const isModified = JSON.stringify(currentBugs[index]) !== JSON.stringify(originalBugs[index]);

    card.innerHTML = `
        <!-- Header -->
        <header class="bug-header">
            <p class="bug-number">Apple Joke Bug #${String(index + 1).padStart(3, '0')}${isModified ? '<span class="modified-indicator" title="Values modified"></span>' : ''}</p>
            <h2 class="bug-title">${bug.title}</h2>
            <p class="bug-subtitle">${bug.subtitle}</p>
            <p class="bug-description">${bug.description}</p>
            <div class="bug-platforms">
                ${bug.platforms.map(p => `<span class="platform-tag">${p}</span>`).join('')}
            </div>
        </header>

        <!-- Screenshot -->
        <div class="bug-media">
            <div class="bug-screenshot-placeholder">Screenshot: ${bug.screenshot}</div>
            ${bug.videoUrl ? `<a href="${bug.videoUrl}" target="_blank" class="bug-video-link">Watch video</a>` : ''}
        </div>

        <!-- Formula Breakdown -->
        <section class="bug-formula">
            <h3 class="formula-title">The Math <span style="font-weight: normal; text-transform: none;">(click values to edit)</span></h3>

            <!-- User Scope -->
            <div class="formula-scope">
                ${Object.entries(impact.userBreakdown).map(([platform, data]) => `
                    <div class="scope-item">
                        <p class="scope-symbol">${data.symbol}</p>
                        <p class="scope-value">${formatNumber(data.affected)}</p>
                        <p class="scope-label">${platform} users affected</p>
                    </div>
                `).join('')}
                <div class="scope-item">
                    <p class="scope-symbol">f_use</p>
                    <p class="scope-value editable" data-bug="${index}" data-path="scope.featureUsageRate" data-type="percent" data-value="${bug.scope.featureUsageRate}" title="Click to edit">${formatPercent(bug.scope.featureUsageRate)}</p>
                    <p class="scope-label">${bug.scope.featureUsageLabel}</p>
                </div>
                <div class="scope-item">
                    <p class="scope-symbol">f_bug</p>
                    <p class="scope-value editable" data-bug="${index}" data-path="scope.bugEncounterRate" data-type="percent" data-value="${bug.scope.bugEncounterRate}" title="Click to edit">${formatPercent(bug.scope.bugEncounterRate)}</p>
                    <p class="scope-label">${bug.scope.bugEncounterLabel}</p>
                </div>
                <div class="scope-item">
                    <p class="scope-symbol">freq</p>
                    <p class="scope-value editable" data-bug="${index}" data-path="scope.frequencyPerDay" data-type="frequency" data-value="${bug.scope.frequencyPerDay}" title="Click to edit">${bug.scope.frequencyPerDay.toFixed(1)}/day</p>
                    <p class="scope-label">${bug.scope.frequencyLabel}</p>
                </div>
            </div>

            <!-- Behavioral Flow -->
            <div class="formula-flow">
                <p class="flow-title">${bug.behavioralFlow.description}</p>
                <div class="flow-steps">
                    ${impact.stepBreakdown.map((step, stepIndex) => `
                        <div class="flow-step">
                            <span class="step-symbol">${step.symbol}</span>
                            <div class="step-content">
                                <p class="step-action">${step.action}</p>
                                <p class="step-description">${step.description}</p>
                            </div>
                            <div class="step-time">
                                <span class="editable" data-bug="${index}" data-path="behavioralFlow.steps[${stepIndex}].seconds" data-type="seconds" data-value="${step.seconds}" title="Click to edit">${step.seconds}s</span>
                                ${step.retries > 1 ? `<span class="retries">× <span class="editable" data-bug="${index}" data-path="behavioralFlow.steps[${stepIndex}].retries" data-type="frequency" data-value="${step.retries}" title="Click to edit">${step.retries}</span> retries</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Power User Tax -->
            <div class="formula-tax">
                <p class="tax-title">${bug.powerUserTax.description}</p>
                <div class="tax-items">
                    ${impact.taxBreakdown.map((tax, taxIndex) => `
                        <div class="tax-item">
                            <div class="tax-item-left">
                                <span class="tax-item-symbol">${tax.symbol}</span>
                                <span class="tax-item-action">${tax.action}</span>
                            </div>
                            <div class="tax-item-right">
                                <span class="editable" data-bug="${index}" data-path="powerUserTax.sinks[${taxIndex}].seconds" data-type="seconds" data-value="${tax.seconds}" title="Click to edit">${formatTime(tax.seconds)}</span> ×
                                <span class="editable" data-bug="${index}" data-path="powerUserTax.sinks[${taxIndex}].participation" data-type="percent" data-value="${tax.participation}" title="Click to edit">${formatPercent(tax.participation)}</span> of users
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${isModified ? `<button class="reset-button" onclick="resetBug(${index})">Reset to original values</button>` : ''}
        </section>

        <!-- Impact -->
        <section class="bug-impact">
            <h3 class="impact-section-title">The Damage</h3>
            <div class="impact-stats">
                <div class="impact-stat">
                    <p class="impact-stat-label">Wasted Per Day</p>
                    <p class="impact-stat-value time">${formatYears(impact.dailyYears)}</p>
                    <p class="impact-stat-note">${formatNumber(Math.round(impact.dailyHours))} hours of human life</p>
                </div>
                <div class="impact-stat">
                    <p class="impact-stat-label">Wasted Per Year</p>
                    <p class="impact-stat-value time">${formatYears(impact.annualYears)}</p>
                    <p class="impact-stat-note">${formatNumber(Math.round(impact.annualHours))} hours</p>
                </div>
                <div class="impact-stat">
                    <p class="impact-stat-label">Total Since Reported</p>
                    <p class="impact-stat-value time">${formatYears(impact.totalYearsSinceReported)}</p>
                    <p class="impact-stat-note">${impact.yearsUnfixed} years of Apple neglect</p>
                </div>
                <div class="impact-stat">
                    <p class="impact-stat-label">Cost to Humanity</p>
                    <p class="impact-stat-value money">${formatMoney(impact.annualCostToHumanity)}</p>
                    <p class="impact-stat-note">per year in lost productivity</p>
                </div>
            </div>
        </section>

        <!-- Verdict -->
        <section class="bug-verdict">
            <p class="verdict-text">
                Apple could fix this in <strong>${bug.engineeringEstimate.hoursToFix} engineering hours</strong>
                (${bug.engineeringEstimate.teamSize} engineer${bug.engineeringEstimate.teamSize > 1 ? 's' : ''}, ${bug.engineeringEstimate.sprints} sprint${bug.engineeringEstimate.sprints > 1 ? 's' : ''}).
                Instead, humanity wastes <strong>${formatNumber(Math.round(impact.dailyHours / 86400 * 100) / 100)} hours every second</strong>.
            </p>
        </section>

        <!-- Footer -->
        <footer class="bug-footer">
            <div class="bug-tags">
                ${bug.tags.map(tag => `<span class="bug-tag">${tag}</span>`).join('')}
            </div>
            <p class="bug-date">Reported: ${formatDate(bug.reportedDate)} · <strong>${impact.yearsUnfixed} years unfixed by Apple</strong></p>
        </footer>
    `;

    return card;
}

function updateTotalImpact(impacts) {
    const totalAnnualYears = impacts.reduce((sum, i) => sum + i.annualYears, 0);
    const totalElement = document.getElementById('total-time');
    totalElement.textContent = formatYears(totalAnnualYears) + '/year';
}

function renderAll() {
    const engine = new FormulaEngine(constants);
    const impacts = currentBugs.map(bug => engine.calculateImpact(bug));

    const container = document.getElementById('bugs-container');
    container.innerHTML = '';

    currentBugs.forEach((bug, index) => {
        const card = renderBugCard(bug, impacts[index], index);
        container.appendChild(card);
    });

    updateTotalImpact(impacts);
}

// ========== Main ==========

async function main() {
    try {
        await loadData();
        renderAll();

        // Add global click handler for editable values
        document.addEventListener('click', handleEditableClick);

    } catch (error) {
        console.error('Failed to load data:', error);
        const container = document.getElementById('bugs-container');
        container.innerHTML = `<p class="loading">Error loading Apple's bugs. Check console for details.</p>`;
    }
}

// Make functions available globally for onclick handlers
window.resetBug = resetBug;
window.resetAll = resetAll;

main();
