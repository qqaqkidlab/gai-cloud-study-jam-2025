// pages/api/check-badges.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSDOM } from 'jsdom';
import { validBadges, dateRange } from '../../config/validBadges';

// Helper function to compare dates
const isDateInRange = (badgeDate: Date, startDate: Date, endDate: Date): boolean => {
    return badgeDate >= startDate && badgeDate <= endDate;
};

// Function to parse a date with timezone like "Earned Oct 9, 2024 EDT"
const parseBadgeDate = (dateStr: string): Date => {
    // Regex to capture the full date, ignoring the timezone (e.g., "Oct 9, 2024")
    dateStr = dateStr.replace(/\s{2,}/g,' ');
    const datePattern = /Earned (\w+ \d{1,2}, \d{4})/;
    const match = dateStr.match(datePattern);
    if (match) {
        const dateString = match[1];
        // Parse the date without the timezone (we are only interested in the date)
        return new Date(dateString);
    }
    return new Date("Oct 10, 2020");
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { profileUrl } = req.body;

    if (!profileUrl) {
        return res.status(400).json({ error: 'Profile URL is required' });
    }

    try {
        const baseUrl = "https://www.cloudskillsboost.google/public_profiles/"
        if (!profileUrl.startsWith(baseUrl)){
            return res.status(400).json({ error: 'Cloud Skills Boost Profile URL is required' });
        }
        const refined_profileUrl = profileUrl.split('?')[0];
        // Fetch the profile page HTML
        const response = await fetch(refined_profileUrl);
        const html = await response.text();

        // Parse the HTML using jsdom
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Get all elements with class 'profile-badge'
        const badges = document.querySelectorAll('.profile-badge');

        // Parse the date range from the config
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        // Initialize counts for each tier
        let tier1Count = 0;
        let tier2Count = 0;
        let tier3Count = 0;
        
        let oldBadges = 0;
        let old1Count = 0;
        let old2Count = 0;
        let old3Count = 0;
        let outOfRangeCount = 0;

        let totalBadgesGained = 0;

        // Final tier level
        let finalTier = 0;

        // Check badges
        badges.forEach((badge) => {
            const spans = badge.querySelectorAll('span.ql-title-medium.l-mts');
            spans.forEach((span) => {
                const title = (span.textContent || '').trim();
                const badgeText = (badge.textContent || '').trim();
                const badgeDate = parseBadgeDate(badgeText);
                const match = isDateInRange(badgeDate, startDate, endDate);
                if (!validBadges.tier1.includes(title) && !validBadges.tier2.includes(title) && !validBadges.tier3.includes(title)){
                    return;
                }

                // Check Tier 1 badges
                if (validBadges.tier1.includes(title)) {
                    if (match) {
                        tier1Count++;
                        totalBadgesGained++; // Increment total gained badges
                    } else {
                        if (badgeDate < startDate){
                            oldBadges++;
                            old1Count++;
                        }
                        //oldBadges++;
                        //old1Count++;
                        else {
                            outOfRangeCount++;
                        }
                    }
                }

                // Check Tier 2 badges (only if Tier 1 is complete)
                if (validBadges.tier2.includes(title)) {
                    if (match) {
                        tier2Count++;
                        totalBadgesGained++; // Increment total gained badges
                    } else {
                        if (badgeDate < startDate){
                            oldBadges++;
                            old2Count++;
                        }
                        //oldBadges++;
                        //old2Count++;
                        else {
                            outOfRangeCount++;
                        }
                    }
                }

                // Check Tier 3 badges (only if Tier 2 is complete)
                if (validBadges.tier3.includes(title)) {
                    if (match) {
                        tier3Count++;
                        totalBadgesGained++; // Increment total gained badges
                    } else {
                        if (badgeDate < startDate){
                            oldBadges++;
                            old3Count++;
                        }
                        //oldBadges++;
                        //old3Count++;
                        else {
                            outOfRangeCount++;
                        }
                    }
                }
            });
        });

        // Determine final tier reached based on the completion status of each tier
        if (tier1Count === validBadges.tier1.length) {
            finalTier = 1;
        }
        if (finalTier === 1 && tier2Count === validBadges.tier2.length) {
            finalTier = 2;
        }
        if (finalTier === 2 && tier3Count === validBadges.tier3.length) {
            finalTier = 3;
        }

        // Send the result as a response
        res.status(200).json({
            finalTier,
            tier1Complete: tier1Count === validBadges.tier1.length,
            tier2Complete: tier2Count === validBadges.tier2.length,
            tier3Complete: tier3Count === validBadges.tier3.length,
            tier1BadgesCount: tier1Count,
            tier2BadgesCount: tier2Count,
            tier3BadgesCount: tier3Count,
            old1BadgesCount: old1Count,
            old2BadgesCount: old2Count,
            old3BadgesCount: old3Count,
            totalTier1Badges: validBadges.tier1.length,
            totalTier2Badges: validBadges.tier2.length,
            totalTier3Badges: validBadges.tier3.length,
            oldBadgesCount: oldBadges,
            totalBadgesGained,
            outOfRangeCount,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to check badges' });
    }
}