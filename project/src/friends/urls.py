from .views import *
from django.urls import path


urlpatterns = [
    path('', ListFriendView.as_view(), name='friends_list'),
    path('requests/', ListRequestsFriendView.as_view(), name='friends_requests'),
    path('sent_requests/', ListSentRequestsFriendView.as_view(), name='friends_sent_requests'),
    path('rejected_requests/', ListRejectedRequestsFriendView.as_view(), name='friends_rejected_requests'),
    path('search_friends/', SearchFriendsView.as_view(), name='friends_search'),
    path('add_friend/', AddFriendsView.as_view(), name='add_friend'),
    path('remove_friend/', DeleteFriendsView.as_view(), name='remove_friend'),
    path('accept_request/', AcceptFriendRequestView.as_view(), name='friends_accept_request'),
    path('reject_request/', RejectFriendRequestView.as_view(), name='friends_reject_request'),

]
