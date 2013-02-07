import sys, random, time
from PyQt4 import QtGui, QtCore


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
		#ui = QtGui.QWidget()




		self.domain = QtGui.QLineEdit("",self)
		self.domain.setPlaceholderText("Domain")
		self.vlayout.addWidget(self.domain)

		self.password = QtGui.QLineEdit("",self)
		self.password.setPlaceholderText("Password")
		self.vlayout.addWidget(self.password)


		self.displayPasswordButton = QtGui.QPushButton("Show Password", self)
		self.displayPasswordButton.clicked.connect(self.displayPassword)
		self.vlayout.addWidget(self.displayPasswordButton)


		self.copyPasswordButton = QtGui.QPushButton("Copy Password to Clipboard", self)
		self.copyPasswordButton.clicked.connect(self.copyPassword)
		self.vlayout.addWidget(self.copyPasswordButton)


		#ui.setLayout(self.vlayout)

		self.hlayout.addLayout(self.vlayout)

		self.hlayout.addStretch(1)

		self.setLayout(self.hlayout)
		self.vlayout.addStretch(1)
		#self.setCentralWidget(ui)
		#QtGui.QApplication.setStyle(QtGui.QStyleFactory.create('Cleanlooks'))

	def displayPassword():
		pass

	def copyPassword():
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