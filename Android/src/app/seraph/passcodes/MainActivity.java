package app.seraph.passcodes;

import android.annotation.TargetApi;
import android.app.Activity;
//import android.text.ClipboardManager;
//import android.content.ClipData;
//import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		Button tasklistButton = (Button) findViewById(R.id.generateButton);
		tasklistButton.setOnClickListener(new OnClickListener() { public void onClick(View v) { generatePasscode();} } );
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	
	public void generatePasscode() {
		//android.text.ClipboardManager clipboard = (android.text.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
		
		//ClipData clipping = ClipData.newPlainText("simple text","PASTE ME");
		//clipboard.setText("paste me");
		//clipboard.setPrimaryClip(clipping);
		copyToClipboard("HELLO EVERYONE!");
		
		int duration = Toast.LENGTH_SHORT;
		Toast toast = Toast.makeText(this, "Copied To Clipboard"+android.os.Build.VERSION.SDK_INT, duration);
		toast.show();
	}
	
	
	public void copyToClipboard(String clip) {
		// If this divice does not have the new clipboard function then use the old one
		if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.HONEYCOMB) {
			copyToClipboardOld(clip);
		}
		// otherwise use the new one
		else {
			copyToClipboardNew (clip);
		}
	}
	
	@TargetApi(Build.VERSION_CODES.HONEYCOMB)
	public void copyToClipboardNew(String clip) {
		android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
		android.content.ClipData clipping = android.content.ClipData.newPlainText("simple text",clip);
		clipboard.setPrimaryClip(clipping);
	}
	
	@TargetApi(Build.VERSION_CODES.ECLAIR)
	@SuppressWarnings("deprecation")
	public void copyToClipboardOld(String clip) {
		android.text.ClipboardManager clipboard = (android.text.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
		clipboard.setText(clip);
	}
}
