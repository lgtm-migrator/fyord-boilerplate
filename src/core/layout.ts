import { FooterComponent, HeaderComponent } from '../components/module';

export const defaultLayout = async () => /*html*/ `
${await new HeaderComponent().Render()}
<main></main>
${await new FooterComponent().Render()}`;
