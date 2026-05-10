package com.anurag.aluminium.service;

import com.anurag.aluminium.model.Settings;
import com.anurag.aluminium.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final SettingsRepository settingsRepository;

    public Settings getSettings() {
        List<Settings> settingsList = settingsRepository.findAll();
        if (settingsList.isEmpty()) {
            Settings settings = new Settings();
            settings.setDefaultRate(100.0);
            return settingsRepository.save(settings);
        }
        return settingsList.get(0);
    }

    public Settings updateSettings(Double defaultRate) {
        Settings settings = getSettings();
        if (defaultRate != null) {
            settings.setDefaultRate(defaultRate);
        }
        return settingsRepository.save(settings);
    }
}