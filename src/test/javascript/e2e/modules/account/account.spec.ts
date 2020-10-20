import { browser, element, by } from 'protractor';

import SignInPage from '../../page-objects/signin-page';
import NavBarPage from '../../page-objects/navbar-page';
import {
  getToastByInnerText,
  getUserDeactivatedButtonByLogin,
  getModifiedDateSortButton,
  waitUntilDisplayed,
  waitUntilHidden,
} from '../../util/utils';

const expect = chai.expect;

describe('Account', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  const username = process.env.E2E_USERNAME || 'admin';
  const password = process.env.E2E_PASSWORD || 'admin';
  const loginPageTitle = 'login-title';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
  });

  it('should fail to login with bad password', async () => {
    // Login page should appear
    expect(await signInPage.getTitle()).to.eq(loginPageTitle);

    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys('foo');
    await signInPage.loginButton.click();

    // Login page should stay open when login fails
    expect(await signInPage.getTitle()).to.eq(loginPageTitle);
  });

  it('should login with admin account', async () => {
    await browser.get('/');
    await signInPage.get();

    expect(await signInPage.getTitle()).to.eq(loginPageTitle);

    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();

    // Login page should close when login success
    expect(await signInPage.isHidden()()).to.be.true;
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
