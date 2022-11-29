# Full stack mock e-commerce site

## Description

A responsive rubber duck e-commerce site built with NextJS.
NextAuth handles crendentials authentication.

MongoDB holds all product and user data.
Cloudinary stores all product images.

Enter username 'demo' and password 'password' to enter the backend demo.

Visit the [Live Demo](https://duck-shop.vercel.app/).

<br/>

## Features

<table>
  <thead>
    <tr>
    <th></th>
    <th></th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <td>Landing Page</td>
      <td>
        <ul>
          <li>Carousel</li>
          <li>Newsletter Section</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Backend Page</td>
      <td>
        <ul>
          <li>See all products</li>
          <li>Present how products are created/edited</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Dynamic Product Page</td>
      <td>
        <ul>
          <li>Information retrieved from database</li>
          <li>Product id in url</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>NextJS Api</td>
      <td>
        <ul>
          <li>Sign In</li>
          <li>Register</li>
          <li>Search</li>
          <li>Duck by id</li>
          <li>Create</li>
          <li>Edit</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Auth w/ next-auth</td>
      <td>
        <ul>
          <li>jwt sessions</li>
          <li>credentials (username & password)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Backend</td>
      <td>
        <ul>
          <li>Data stored in MongoDB</li>
          <li>Mongoose used for database queries</li>
          <li>Database queries are executed in NextJS api</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Cloudinary</td>
      <td>
        <ul>
          <li>All Product Images are stored on Cloudinary</li>
          <li>Fast and easy asset management</li>
          <li>Access to Cloudinary image transforms</li>
        </ul>
      </td>
    </tr>
    
  </tbody>

</table>

<br/>

## To Do

<table>
  <thead>
    <tr>
    <th></th>
    <th></th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <td>Search Functionality for main page</td>
      <td>
        <ul>
          <li>Search Page showing results</li>
          <li>Pagination</li>
          <li>Addiitonal filters/options</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Add To Cart</td>
      <td>
        <ul>
          <li>Cart Page</li>
          <li>Remove from cart</li>
          <li>Modify Cart data when 'Add to cart' is pressed</li>
        </ul>
      </td>
    </tr>
    <tr>
    <td>Events</td>
    <td>
      <ul>
        <li>Store Event Banners on Backend</li>
        <li>Make API endpoint for retrieving events</li>
        <li>Retrieve and use in main page</li>
        <li>Event details pages (optional depending on the type of 'event')</li>
      </ul>
    </td>
    </tr>
  </tbody>
</table>
