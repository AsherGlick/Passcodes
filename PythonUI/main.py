import sys, random, time
from PyQt4 import QtGui, QtCore



def generatePassword(domain, password):
	return "deadbeef"

#class mainWidget(QtGui.QMainWindow):
class mainWidget(QtGui.QWidget):
	def __init__(self):
		super(mainWidget, self).__init__()
		#self.setStyleSheet("*{margin-left: auto;margin-right: auto}")
		#self.setStyleSheet("*{margin-left: 10px;}")

		self.initUI()


	def initUI(self):
		self.resize(600, 500)
		self.setWindowTitle("Passcod.es Desktop Application")


		
		self.hlayout = QtGui.QHBoxLayout()
		self.hlayout.addStretch(1)
		self.vlayout = QtGui.QVBoxLayout()
		self.vlayout.addStretch(1)
		# Create the domain text box
		self.domain = QtGui.QLineEdit("",self)
		self.domain.setPlaceholderText("Domain")
		self.vlayout.addWidget(self.domain)
		# Create the password text box
		self.password = QtGui.QLineEdit("",self)
		self.password.setPlaceholderText("Password")
		self.vlayout.addWidget(self.password)
		# Create the show password button
		self.displayPasswordButton = QtGui.QPushButton("Show Password", self)
		self.displayPasswordButton.clicked.connect(self.displayPassword)
		self.vlayout.addWidget(self.displayPasswordButton)
		# Create the copy password to clipboard button
		self.copyPasswordButton = QtGui.QPushButton("Copy Password to Clipboard", self)
		self.copyPasswordButton.clicked.connect(self.copyPassword)
		self.vlayout.addWidget(self.copyPasswordButton)
		# Finish configuring the layput
		self.vlayout.addStretch(1)
		self.hlayout.addLayout(self.vlayout)
		self.hlayout.addStretch(1)
		# Set the layout to the hlayout
		self.setLayout(self.hlayout)


	def displayPassword(self):
		pass

	def copyPassword(self):
		pass





# call the main widget
def main():
	app = QtGui.QApplication(sys.argv)

	gui = mainWidget()
	gui.show()

	app.exec_()
	print "Exiting"
	exit()

# run the main function
if __name__ == '__main__':
	#
	main()