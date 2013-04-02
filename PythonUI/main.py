import sys, random, time, hashlib
from PyQt4 import QtGui, QtCore
import base64


#create the sha256 hash
# convert the pasword into base64 using ! and # instead of + and /
# return the first 16 characters of that hash
def generatePassword(domain, password):
	hashedPassword = hashlib.sha256(domain+password).digest()
	base64Password = base64.b64encode(hashedPassword)
	return base64Password[0:16]

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
		#self.resize(70, 70)
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
		self.password.setEchoMode(QtGui.QLineEdit.Password)
		self.password.setPlaceholderText("Password")
		self.inputvlayout.addWidget(self.password)
		# Create the show password button
		self.displayPasswordButton = QtGui.QPushButton("Copy Password", self)
		self.displayPasswordButton.clicked.connect(self.displayPassword)
		self.inputvlayout.addWidget(self.displayPasswordButton)
		# Create the box to display the password in
		self.displayPasswordBox = QtGui.QLabel("I am a password",self)
		self.displayPasswordBox.setAlignment(QtCore.Qt.AlignHCenter)
		self.displayPasswordBox.hide()
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
			hashpassword = generatePassword(str(self.domain.text()),str(self.password.text()))
			self.displayPasswordBox.setText(hashpassword)
			self.displayPasswordBox.show()

		else:
			self.copyPassword()
	def copyPassword(self):
		hashpassword = generatePassword(self.domain.text(),self.password.text())
		clipboard = QtGui.QApplication.clipboard()
		clipboard.setText(hashpassword)
		self.displayPasswordButton.setText("Display Password")
		self.isPasswordCopied = True





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