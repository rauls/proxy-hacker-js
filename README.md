# Proxy Hacker

This is a small proof of concept proxy server that uses a default.pac file logic to determine which proxy
server to use. Normally this would be done in a complex ugly ACL list thats hard to understand and modify
but if squid supported JS based ACL logic, it would be more flexible.

In this example, we use mediahints default.pac file from March 2014 that was used to bypass geoblocking
for viewing media content that is usually blocked. Mediahint now charge for this service, but it would be easy
to duplicate their service if you had non blocked servers in USA, UK, EU as proxies.

Enjoy.

