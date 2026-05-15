# Architecture Overview

## Structure

(.github/workflows folder)
    deploy.yml
(css folder)
    styles.css
(img folder)
    DB Profile Pic (150 x 150).png
    DB Profile Pic (150 x 150).png
    LD Profile Pic (150 x 150).png
    MS Profile Pic (150 x 150).png
    Pinnacle Logo (60 x 60 px).png
    RU Profile Pic (150 x 150).png
    car-logo.png
    heart-icon (120 x 120).png
    house-logo (120 x 120) (1).png
    pinnacle-insurance-logo.png
    pinnacle-nsurance-logo-(60 x 60 px).png
(js folder)
    main.js
    quote.js
README.md
about.html
faq.html
index.html
quote.html


## Component/ Page Organization

Components:
Bootstrap Navbar, Cards and Grid: They helped with page layout and site navigation
Bootstrap Accordian: It was used to hold FAQ info
Search Bar: Used to help the user narrow down info in the FAQ page

index.html: the first page users experience. There is a hero sections with company info and a button to take the user to quote.html. Next there is a section detailing why the user should choose the company and 
finaly a section breaking down the different innsurance products the company offers.

quote.html: the user is first greated by three cards corralating to the three different insurance products the company offers, from there the user can click on one and a form will pop up related to the type of insurance they selected. From there the can input their
info to submit and the page will display an info card telling them their innsurance quote and the parameters that went in to deciding why their quote is the cost that it is.

about.html: the user is greeted by a hero section giving a brief history of the company, they can scroll down to see a section detailing the company's vales and another section introducing the senior managment team.

faq.html: the last page is an faq page with a Bootstrap accordian compenet and a search bar. The user can click through the different sections to read an answer to one of the questions
or they can use the search bar to narrow down the field to whichever question best matches what they are looking for.


##Data Flow

The Data flow if very simplistic for this site. Users can input some basic info, the site runs it through javascript logic and presents the data back to the user. Also the site can take in search prompts from the user and narrow down the amount of info on screen
depending on what they typed.


## Deployment Approach:
GitHub Pages


## Key tech decisions and trade-offs

I choose to focus on a mobile first approach to make sure I had an easier time later with development. First I made sure pages and elements fit in a smaller width screen and then build out from there, using media queries to adjust as the screen gets bigger.
I used Bootstrap components and grid to help with development and layout. I found that to help speed up the proccess.

I chose to go with functional over pretty as a tradeoff for my design. Since I struggled at the beggining to get the quote algorithm correct, I felt it was better to hand in a functional website instead of a pretty one that didnt work or wasnt responsive.

## What would you go back and improve?

I would definetly go back and polish up the css styling for each page so that the site looks more polished.

    
