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
		self.setStyleSheet("""
			QPushButton {
				width:200px;
				height: 30px;
			}
			QLineEdit {
				height: 30px;
			}
			QLabel {
				margin-top: 9px;
				margin-bottom: 6px;
			}
			""")
		self.initUI()
		self.isPasswordCopied = False


	def initUI(self):
		self.resize(70, 70)
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
		self.displayPasswordButton = QtGui.QPushButton("Copy Password", self)
		self.displayPasswordButton.clicked.connect(self.displayPassword)
		self.inputvlayout.addWidget(self.displayPasswordButton)
		# Create the box to display the password in
		self.displayPasswordBox = QtGui.QLabel("I am a password",self)
		self.displayPasswordBox.setAlignment(QtCore.Qt.AlignHCenter)
		self.inputvlayout.addWidget(self.displayPasswordBox)
		# Finish configuring the layput
		self.inputvlayout.addStretch(1)
		self.inputhlayout.addLayout(self.inputvlayout)
		self.inputhlayout.addStretch(1)
		# Set the layout to the hlayout
		self.setLayout(self.inputhlayout)


	def displayPassword(self):
		if self.isPasswordCopied:
			# display the password if it has already been copied
			pass

		else:
			self.copyPassword()
	def copyPassword(self):
		self.displayPasswordButton.setText("Display Password")





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