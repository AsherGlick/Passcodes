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

		self.inputhlayout = QtGui.QHBoxLayout()
		self.inputhlayout.addStretch(1)
		self.inputvlayout = QtGui.QVBoxLayout()
		self.inputvlayout.addStretch(1)
		# Create the domain text box
		self.domain = QtGui.QLineEdit("",self)
		self.domain.setPlaceholderText("Domain")
		self.inputvlayout.addWidget(self.domain)
		# Create the password text box
		self.password = QtGui.QLineEdit("",self)
		self.password.setPlaceholderText("Password")
		self.inputvlayout.addWidget(self.password)
		# Create the show password button
		self.displayPasswordButton = QtGui.QPushButton("Show Password", self)
		self.displayPasswordButton.clicked.connect(self.displayPassword)
		self.inputvlayout.addWidget(self.displayPasswordButton)
		# Create the copy password to clipboard button
		self.copyPasswordButton = QtGui.QPushButton("Copy Password to Clipboard", self)
		self.copyPasswordButton.clicked.connect(self.copyPassword)
		self.inputvlayout.addWidget(self.copyPasswordButton)
		# Finish configuring the layput
		self.inputvlayout.addStretch(1)
		self.inputhlayout.addLayout(self.inputvlayout)
		self.inputhlayout.addStretch(1)
		# Set the layout to the hlayout
		self.setLayout(self.inputhlayout)


	def displayPassword(self):
		self.outputhlayout = QtGui.QHBoxLayout()
		self.outputhlayout.addStretch(1)
		self.outputvlayout = QtGui.QVBoxLayout()
		self.outputvlayout.addStretch(1)
		# Create the domain text box
		self.domain = QtGui.QLineEdit("",self)
		#############self.domain.setPlaceholderText("Domain")################### will be set text
		self.outputvlayout.addWidget(self.domain)
		# Create the button to return to the main display
		self.displayPasswordButton = QtGui.QPushButton("Back", self)
		self.displayPasswordButton.clicked.connect(self.initUI)
		self.outputvlayout.addWidget(self.displayPasswordButton)
		# Finish configuring the layput
		self.outputvlayout.addStretch(1)
		self.outputhlayout.addLayout(self.outputvlayout)
		self.outputhlayout.addStretch(1)
		# Set the layout to the hlayout
		self.inputhlayout.setParent(None)
		self.setLayout(self.outputhlayout)

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