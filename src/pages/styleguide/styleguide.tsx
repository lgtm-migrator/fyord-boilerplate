import { ParseJsx, Page, Route } from 'fyord';
import { Routes } from '../routes';
import { Lorem } from '../../Lorem';
import { Classes } from '../../enums/classes';
import styles from './styleguide.module.scss';

export class StyleguidePage extends Page {
  Title = 'Styleguide';

  Route = (route: Route) => route.path === Routes.Styleguide;
  Html = async () => {
    return <div>
      <h1>Styleguide</h1>

      <section>
        <h2>Headings</h2>

        <h1>Heading level 1</h1>
        <h2>Heading level 2</h2>
        <h3>Heading level 3</h3>
        <h4>Heading level 4</h4>
      </section>

      <section>
        <h2>Copy</h2>

        <p><b>Bold</b></p>
        <p><strong>Strong</strong></p>
        <p><i>Italic</i></p>
        <p><em>Emphasis</em></p>
        <p><a href="#">Inline link</a></p>

        <p>{Lorem.Ipsum()}</p>

        <blockquote>{Lorem.Ipsum(50)}.</blockquote>

        <ol class={Classes.ListStyle}>
          <li><span>One</span></li>
          <li><span>Two</span></li>
          <li><span>Three</span></li>
        </ol>

        <ul class={Classes.ListStyle}>
          <li><span>One</span></li>
          <li><span>Two</span></li>
          <li><span>Three</span></li>
        </ul>
      </section>

      <section>
        <h2>Inputs</h2>

        <div><button>Button</button></div>

        <div><a href="#" class={Classes.LinkButton}>Link Button</a></div>

        <div class={Classes.InputContainer}>
          <label for="textInput">Text Input</label>
          <input id="textInput" type="text"></input>
        </div>

        <div class={Classes.InputContainer}>
          <label for="textInputError">Error State Text Input</label>
          <input class={Classes.InputErrorState} id="textInputError" type="text"></input>
        </div>

        <div class={Classes.InputContainer}>
          <label for="checkbox">Checkbox</label>
          <input id="checkbox" type="checkbox"></input>
        </div>

        <div class={Classes.InputContainer}>
          <label for="textarea">Textarea</label>
          <textarea id="textarea"></textarea>
        </div>

        <div class={Classes.InputContainer}>
          <label for="textarea">Radio</label>

          <input type="radio" id="male" name="gender" value="male" />
          <label for="male">Male</label>
          <input type="radio" id="female" name="gender" value="female" />
          <label for="female">Female</label>
        </div>

        <div class={Classes.InputContainer}>
          <label for="select">Select</label>

          <select name="select" id="select">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>

        <div class={Classes.InputContainer}>
          <label for="datalist">Datalist</label>
          <input type="datalist" list="datalistOptions" name="datalist" id="datalist" />

          <datalist id="datalistOptions">
            <option value="One" />
            <option value="Two" />
            <option value="Three" />
          </datalist>
        </div>
      </section>

      <section>
        <h2>Table</h2>

        <table>
          <thead>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </thead>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
          </tr>
          <tr>
            <td>Ernst Handel</td>
            <td>Roland Mendel</td>
            <td>Austria</td>
          </tr>
          <tr>
            <td>Island Trading</td>
            <td>Helen Bennett</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>Laughing Bacchus Winecellars</td>
            <td>Yoshi Tannamuri</td>
            <td>Canada</td>
          </tr>
          <tr>
            <td>Magazzini Alimentari Riuniti</td>
            <td>Giovanni Rovelli</td>
            <td>Italy</td>
          </tr>
        </table>
      </section>

      <section>
        <h2>Media</h2>

        <h3>Images</h3>
        <div>
          <img src={Lorem.ImageUrl(240, 120)} alt="Non-cropped image" />
        </div>

        <div class={`${styles.square} ${Classes.CropImageContainer}`}>
          <img src={Lorem.ImageUrl(360, 120, '240x120 Cropped to 120x120')} alt="Cropped image" />
        </div>
      </section>
    </div>;
  };
}
