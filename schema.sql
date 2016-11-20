CREATE TABLE users (
userID int(11) NOT NULL AUTO_INCREMENT,
fname varchar(255) NOT NULL,
lname varchar(255) NOT NULL,
pword varchar(255) NOT NULL,
stat int(11) NOT NULL,
PRIMARY KEY (userID)
);


CREATE TABLE messages(
msgID int(11) NOT NULL AUTO_INCREMENT,
sendID int(11) NOT NULL,
recID int(11) NOT NULL,
messagetxt varchar(255) NOT NULL,
PRIMARY KEY (msgID),
FOREIGN KEY (sendID) REFERENCES users (userID),
FOREIGN KEY (recID) REFERENCES users (userID)
);




CREATE TABLE pairs (         	
menteeID int(11) NOT NULL,    	
mentorID int(11) NOT NULL,         	
PRIMARY KEY (menteeID, mentorID),         	
FOREIGN KEY (menteeID) REFERENCES users (userID),
FOREIGN KEY (mentorID) REFERENCES users (userID)
) ENGINE=InnoDB DEFAULT  CHARSET=utf8;