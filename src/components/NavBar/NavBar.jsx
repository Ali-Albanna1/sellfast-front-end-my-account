import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import styles from "../NavBar/Navbar.module.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        {/* Left side: Common links + user-specific links */}
        <div className={styles.leftSection}>
          <ul className={styles.list}>
            {/* Always show these links */}
            {user?.is_admin && (<li><Link className={styles.link} to="/">Dashboard</Link></li>)}
            <li><Link className={styles.link} to="/products">Products</Link></li>
            <li><Link className={styles.link} to="/services">Services</Link></li>

            {user && (
              <>
                {/* Show My Bookings only for non-admin users */}
                {!user.is_admin && (
                  <li><Link className={styles.link} to="/bookings/me">My Bookings</Link></li>
                )}

                {/* Show Cart only for non-admin users */}
                {!user.is_admin && (
                  <li>
                    <Link className={styles.link} to={`/cart-items/${user.cartId}`}>
                      Cart
                    </Link>
                  </li>
                )}

                <li>
                  <Link className={styles.link} to="/orders">
                    {user.is_admin ? "Orders" : "My Orders"}
                  </Link>
                </li>

                {/* Admin-only links */}
                {user.is_admin && (
                  <>
                    <li>
                      <Link className={styles.link} to="/products/create">
                        + Product
                      </Link>
                    </li>
                    <li>
                      <Link className={styles.link} to="/services/create">
                        + Service
                      </Link>
                    </li>
                    <li>
                      <Link className={styles.link} to="/bookings/admin">
                        Bookings
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Right side: Welcome message and auth links */}
        <div className={styles.rightSection}>
          <ul className={styles.list}>
            {user ? (
              <>
                <li className={styles.welcome}>
                  Welcome, <span className={styles.username}>{user.username}</span>
                </li>
                <li>
                  <Link
                    className={`${styles.link} ${styles.signOutLink}`}
                    to="/"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className={`${styles.link} ${styles.signInLink}`} to="/sign-in">Sign In</Link>
                </li>
                <li>
                  <Link className={styles.link} to="/sign-up">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;