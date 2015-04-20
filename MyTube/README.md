YoutubeAPI
==========

This project is a simple Youtube search app using jQuery AJAX. This allow users to type in a search query and it will fetch 20 videos per page.

The hardest part was that I never used the Youtube API before:

1) I spent some time reading the API and establishing the API key
2) I also read through the required parameters and optional parameters to add to the data parameter for AJAX
3) The hard part was fetching the next 20 results using pageToken

The most interesting part was creating the AJAX for retrieving the Youtube results:

1) It was exciting adding parameters with javascript objects into the data parameters using $.ajax
2) The other part was using the results to display to the user by displaying the titles, description, thumbnails, url,publishedAt, channelTitle, and its Ids
