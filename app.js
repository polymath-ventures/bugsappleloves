/**
 * Joke Bugs - Formula Engine & Renderer
 */

// ========== Data Loading ==========

async function loadData() {
    const [constantsRes, bugsRes] = await Promise.all([
        fetch('data/constants.json'),
        fetch('data/bugs.json')
    ]);

    const constants = await constantsRes.json();
    const bugsData = await bugsRes.json();

    return { constants, bugs: bugsData.bugs };
}

// ========== Formula Engine ==========

class FormulaEngine {
    constructor(constants) {
        this.constants = constants;
        this.platformUsers = constants.platformUsers;
        this.appleFacts = constants.appleFacts;
    }

    /**
     * Calculate total affected users for a bug across all its platforms
     */
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

    /**
     * Calculate time per incident from behavioral flow
     */
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

    /**
     * Calculate daily power user tax
     */
    calculatePowerUserTax(bug, affectedUsers) {
        const { powerUserTax } = bug;
        let dailyTaxSeconds = 0;
        const taxBreakdown = [];

        for (const sink of powerUserTax.sinks) {
            // Convert to daily: (seconds * participation) / frequencyDays
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

    /**
     * Calculate years since bug was reported
     */
    calculateYearsUnfixed(bug) {
        const reportedDate = new Date(bug.reportedDate);
        const now = new Date();
        const diffMs = now - reportedDate;
        const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        return Math.round(diffYears * 10) / 10; // Round to 1 decimal
    }

    /**
     * Calculate full impact for a bug
     */
    calculateImpact(bug) {
        // Affected users
        const { totalUsers, breakdown: userBreakdown } = this.calculateAffectedUsers(bug);

        // Time per incident
        const { totalSeconds: secondsPerIncident, stepBreakdown } = this.calculateTimePerIncident(bug);

        // Daily base impact (everyone)
        const dailyBaseSeconds = totalUsers * bug.scope.frequencyPerDay * secondsPerIncident;

        // Power user tax
        const { dailyTaxSeconds, taxBreakdown } = this.calculatePowerUserTax(bug, totalUsers);

        // Total daily seconds
        const dailyTotalSeconds = dailyBaseSeconds + dailyTaxSeconds;

        // Shame factors
        const yearsUnfixed = this.calculateYearsUnfixed(bug);
        const pressureFactor = bug.shameFactors.pressureFactor;

        // Apply shame multiplier (years * pressure as a soft multiplier)
        // We use sqrt to prevent astronomical numbers
        const shameMultiplier = 1 + (Math.sqrt(yearsUnfixed) * (pressureFactor - 1));
        const adjustedDailySeconds = dailyTotalSeconds * shameMultiplier;

        // Convert to human-readable
        const dailyHours = adjustedDailySeconds / 3600;
        const dailyYears = dailyHours / (24 * 365.25); // Human-years per day
        const annualHours = dailyHours * 365;
        const annualYears = dailyYears * 365;

        // Total since bug reported
        const daysSinceReported = yearsUnfixed * 365.25;
        const totalHoursSinceReported = dailyHours * daysSinceReported;
        const totalYearsSinceReported = dailyYears * daysSinceReported;

        // Engineering comparison
        const engHoursToFix = bug.engineeringEstimate.hoursToFix;
        const engHoursPerYear = this.appleFacts.engineerHoursPerWeek.value * 52 * this.appleFacts.engineerProductiveHours.value;
        const fixesPerYear = annualHours / engHoursToFix;
        const humanYearsPerEngYear = annualYears; // How many human-years wasted per year

        // Cost comparison
        const hourlyWage = 30; // Assume average affected user hourly value
        const annualCostToHumanity = annualHours * hourlyWage;
        const engSalary = this.appleFacts.engineerSalary.value;
        const engineersPayable = annualCostToHumanity / engSalary;

        return {
            // User scope
            affectedUsers: totalUsers,
            userBreakdown,

            // Time breakdown
            secondsPerIncident,
            stepBreakdown,

            // Power user tax
            dailyTaxSeconds,
            taxBreakdown,

            // Daily impact
            dailyBaseSeconds,
            dailyTotalSeconds,
            shameMultiplier,
            adjustedDailySeconds,
            dailyHours,
            dailyYears,

            // Annual impact
            annualHours,
            annualYears,

            // Cumulative impact
            yearsUnfixed,
            totalHoursSinceReported,
            totalYearsSinceReported,

            // Shame
            pressureFactor,

            // Engineering comparison
            engHoursToFix,
            fixesPerYear,
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

// ========== Renderer ==========

function renderBugCard(bug, impact, index, constants) {
    const card = document.createElement('article');
    card.className = 'bug-card';

    card.innerHTML = `
        <!-- Header -->
        <header class="bug-header">
            <p class="bug-number">Joke Bug #${String(index + 1).padStart(3, '0')}</p>
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
            <h3 class="formula-title">The Math</h3>

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
                    <p class="scope-symbol">U_total</p>
                    <p class="scope-value">${formatNumber(impact.affectedUsers)}</p>
                    <p class="scope-label">Total affected</p>
                </div>
            </div>

            <!-- Behavioral Flow -->
            <div class="formula-flow">
                <p class="flow-title">${bug.behavioralFlow.description}</p>
                <div class="flow-steps">
                    ${impact.stepBreakdown.map(step => `
                        <div class="flow-step">
                            <span class="step-symbol">${step.symbol}</span>
                            <div class="step-content">
                                <p class="step-action">${step.action}</p>
                                <p class="step-description">${step.description}</p>
                            </div>
                            <div class="step-time">
                                ${step.seconds}s${step.retries > 1 ? ` <span class="retries">× ${step.retries} retries</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Power User Tax -->
            <div class="formula-tax">
                <p class="tax-title">${bug.powerUserTax.description}</p>
                <div class="tax-items">
                    ${impact.taxBreakdown.map(tax => `
                        <div class="tax-item">
                            <div class="tax-item-left">
                                <span class="tax-item-symbol">${tax.symbol}</span>
                                <span class="tax-item-action">${tax.action}</span>
                            </div>
                            <div class="tax-item-right">
                                ${formatTime(tax.seconds)} × ${(tax.participation * 100).toFixed(0)}% of users
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
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
                    <p class="impact-stat-note">${impact.yearsUnfixed} years of neglect</p>
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
                This bug could be fixed in <strong>${bug.engineeringEstimate.hoursToFix} engineering hours</strong>
                (${bug.engineeringEstimate.teamSize} engineers, ${bug.engineeringEstimate.sprints} sprint${bug.engineeringEstimate.sprints > 1 ? 's' : ''}).
                Instead, humanity wastes that many hours every <strong>${formatTime(bug.engineeringEstimate.hoursToFix * 3600 / impact.dailyHours)}</strong>.
            </p>
        </section>

        <!-- Footer -->
        <footer class="bug-footer">
            <div class="bug-tags">
                ${bug.tags.map(tag => `<span class="bug-tag">${tag}</span>`).join('')}
            </div>
            <p class="bug-date">Reported: ${formatDate(bug.reportedDate)} · <strong>${impact.yearsUnfixed} years unfixed</strong></p>
        </footer>
    `;

    return card;
}

function updateTotalImpact(bugs, impacts) {
    const totalAnnualYears = impacts.reduce((sum, i) => sum + i.annualYears, 0);
    const totalElement = document.getElementById('total-time');
    totalElement.textContent = formatYears(totalAnnualYears) + '/year';
}

// ========== Main ==========

async function main() {
    try {
        const { constants, bugs } = await loadData();
        const engine = new FormulaEngine(constants);

        // Calculate impacts
        const impacts = bugs.map(bug => engine.calculateImpact(bug));

        // Clear loading state
        const container = document.getElementById('bugs-container');
        container.innerHTML = '';

        // Render bugs
        bugs.forEach((bug, index) => {
            const card = renderBugCard(bug, impacts[index], index, constants);
            container.appendChild(card);
        });

        // Update total
        updateTotalImpact(bugs, impacts);

    } catch (error) {
        console.error('Failed to load data:', error);
        const container = document.getElementById('bugs-container');
        container.innerHTML = `<p class="loading">Error loading bugs. Check console for details.</p>`;
    }
}

main();
