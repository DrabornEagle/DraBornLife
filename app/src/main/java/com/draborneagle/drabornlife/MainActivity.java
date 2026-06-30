package com.draborneagle.drabornlife;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(42, 80, 42, 42);
        root.setBackgroundColor(Color.rgb(16, 24, 32));
        root.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        TextView title = new TextView(this);
        title.setText("DraBornLife");
        title.setTextColor(Color.WHITE);
        title.setTextSize(34);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        root.addView(title, fullWidthWrap());

        TextView subtitle = new TextView(this);
        subtitle.setText("Antalya’ya yeni hayat planı");
        subtitle.setTextColor(Color.rgb(244, 185, 66));
        subtitle.setTextSize(18);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 12, 0, 36);
        root.addView(subtitle, fullWidthWrap());

        root.addView(card("Hedef", "Antalya taşınma, yeni ev kurma ve sıfırdan hayat planı."));
        root.addView(card("Birikim", "Gelir, gider, borç ve alınacaklar v0.1 içinde adım adım eklenecek."));
        root.addView(card("Durum", "v0.0.2 Android proje iskeleti hazır."));

        TextView footer = new TextView(this);
        footer.setText("Supabase yok • Web yok • Lokal veri hedefi");
        footer.setTextColor(Color.rgb(184, 194, 204));
        footer.setTextSize(14);
        footer.setGravity(Gravity.CENTER);
        footer.setPadding(0, 40, 0, 0);
        root.addView(footer, fullWidthWrap());

        setContentView(root);
    }

    private LinearLayout.LayoutParams fullWidthWrap() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private TextView card(String heading, String body) {
        TextView view = new TextView(this);
        view.setText(heading + "\n" + body);
        view.setTextColor(Color.WHITE);
        view.setTextSize(17);
        view.setLineSpacing(6, 1.0f);
        view.setPadding(32, 26, 32, 26);
        view.setBackgroundColor(Color.rgb(23, 38, 53));

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, 0, 22);
        view.setLayoutParams(params);

        return view;
    }
}
