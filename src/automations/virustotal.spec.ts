import { test } from '@playwright/test';
import { VirusTotalPO } from '../page-objects/virustotal/upload-page';

test.describe("Virus Total Automation", () => {
    test('VirusTotal-url-scan', async ({ page }) => {
        const virusTotalPO = new VirusTotalPO(page);
        await virusTotalPO.navigateHome();
        await virusTotalPO.selectUploadType("url");
        await virusTotalPO.urlToScan("https://t.me/");
    })
})