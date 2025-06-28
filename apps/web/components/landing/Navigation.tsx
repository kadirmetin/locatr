import { scrollToSection } from '@/lib/utils/scrollToSection';

import { Button } from '../ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '../ui/navigation-menu';

type MenuItem = { href: string; name: string };

const Navigation = ({ menuItems }: { menuItems: MenuItem[] }) => (
  <nav>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {menuItems.map((item) => (
            <Button variant="ghost" key={item.href} onClick={() => scrollToSection(item.href)}>
              {item.name}
            </Button>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
);

export default Navigation;
