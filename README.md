# paypal-test
The website mainly has three pages: index, create and execute.

Workflow:
In the index page, the user can check out a certain product.
Afterward it will enter create page which displays the payment information.
On this page, the user can click the "redirect to Paypal" button, before he logins to Paypal sandbox account and do the simulated payment..
Finishing the process in Paypal sandbox domain, the user will return our domain and see some confirmation message in the execute page.

Technology stack:
Basically, the website is supported by express.js and Paypal Express Checkout API. In addition, we also import a paypal-express-checkout module of nodejs and it offers us much convenience.

