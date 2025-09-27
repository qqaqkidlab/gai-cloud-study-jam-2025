// pages/api/check-badges.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSDOM } from 'jsdom';
import { dateRange, skillBadgeTrue, skillBadgeFalse } from '../../config/validBadges';

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

function renderSetToTableWithHeader(set: Set<string>, skill: string): string {
  let html = "";
  html += "Old " + skill + " Badges<br>";  // Column header
  Array.from(set).forEach((item) => {
    html += `${item}<br>`;
  });
  return html;
}

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
        let totalSkillBadgesCount = 27;
        let totalNonSkillBadgesCount = 55;
        
        let skillBadgesCount = 0;
        let nonSkillBadgesCount = 0;
        
        let oldSkillBadgesCount = 0;
        let oldNonSkillBadgesCount = 0;
        const oldSkillBadgesSet = new Set<string>();
        const oldNonSkillBadgesSet = new Set<string>();

        let outOfRangeCount = 0;
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

                if (skillBadgeTrue.has(title)) {
                  if (match) {
                        skillBadgesCount++;
                    } else {
                        if (badgeDate < startDate){
                            oldSkillBadgesCount++;
                            oldSkillBadgesSet.add(title);
                        }
                        else {
                            outOfRangeCount++;
                        }
                    }
                }

                else if (skillBadgeFalse.has(title)) {
                  if (match) {
                        nonSkillBadgesCount++;
                    } else {
                        if (badgeDate < startDate){
                            oldNonSkillBadgesCount++;
                            oldNonSkillBadgesSet.add(title);
                        }
                        else {
                            outOfRangeCount++;
                        }
                    }
                }

            });
        });

        let tier1Status = false;
        let tier2Status = false;
        let tier3Status = false;
        
        if (skillBadgesCount >= 4 && (skillBadgesCount + nonSkillBadgesCount) >= 10) {
            finalTier = 1;
            tier1Status = true;
        }
        if (skillBadgesCount >= 8 && (skillBadgesCount + nonSkillBadgesCount) >= 20) {
            finalTier = 2;
            tier2Status = true;
        }
        if (skillBadgesCount >= 12 && (skillBadgesCount + nonSkillBadgesCount) >= 30) {
            finalTier = 3;
            tier3Status = true;
        }

        const oldSkillBadgesArray = Array.from(oldSkillBadgesSet);
        const oldCompletedBadgesArray = Array.from(oldNonSkillBadgesSet);

        // Send the result as a response
        res.status(200).json({
            finalTier,
            tier1Complete: tier1Status,
            tier2Complete: tier2Status,
            tier3Complete: tier3Status,
            skillBadgesCount: skillBadgesCount,
            nonSkillBadgesCount: nonSkillBadgesCount,
            totalValidBadgesCount: skillBadgesCount + nonSkillBadgesCount,
            oldSkillBadgesCount: oldSkillBadgesCount,
            oldNonSkillBadgesCount: oldNonSkillBadgesCount,
            totalOldBadgesCount: oldSkillBadgesCount + oldNonSkillBadgesCount,
            oldSkillBadgesSet: oldSkillBadgesArray,
            oldNonSkillBadgesSet: oldCompletedBadgesArray,
            outOfRangeCount,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to check badges' });
    }
}
