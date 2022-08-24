import { expect, Locator, Page } from '@playwright/test';

export class VirusTotalPO {
    readonly page: Page;
    readonly fileTab: Locator;
    readonly urlTab: Locator;
    readonly searchTab: Locator;
    readonly urlTabInputField: Locator;
    readonly searchIcon: Locator;
    readonly searchTabInputField: Locator;

    constructor(page: Page){
        this.page = page;
        this.fileTab = page.locator('text=File URL Search >> #wrapperLink >> nth=0');
        this.urlTab = page.locator('text=File URL Search >> #wrapperLink >> nth=1')
        this.searchTab = page.locator('text=File URL Search >> #wrapperLink >> nth=2')
        this.urlTabInputField = page.locator('input[type="url"]')
        this.searchIcon = page.locator('#urlSearchInput #iconWrapper')
        this.searchTabInputField = page.locator('[placeholder="URL\, IP address\, domain\, or file hash"]')
    }

    async navigateHome(){
        await this.page.goto("https://www.virustotal.com/gui/home/upload")
    }

    async selectUploadType(type: string){
        if (type.toLowerCase() == "file"){
            await this.fileTab.click();
        }
        else if (type.toLowerCase() == "url"){
            await this.urlTab.click();
        }
        else {
            await this.searchTab.click();
        }
    }

    async urlToScan(url: string){
        expect(await this.urlTabInputField.isVisible());
        await this.urlTabInputField.fill(url);
        await this.searchIcon.click();
    }

    async searchScan(data: string){
        expect(await this.searchTabInputField.isVisible());
        await this.searchTabInputField.fill(data);
        await this.page.keyboard.press("Enter");
    }
}