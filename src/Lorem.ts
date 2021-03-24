// eslint-disable-next-line max-len
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export class Lorem {
  public static Ipsum(limit: number = 200): string {
    return loremIpsum.slice(0, limit);
  }

  public static ImageUrl(x: number, y: number, text?: string): string {
    return `https://via.placeholder.com/${x}x${y}.png${text ? `?text=${text}` : ''}`;
  }
}
