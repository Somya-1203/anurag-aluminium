package com.anurag.aluminium.service;

import com.anurag.aluminium.model.WindowType;
import com.anurag.aluminium.repository.WindowTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WindowTypeService {
    private final WindowTypeRepository windowTypeRepository;

    public List<WindowType> getAllWindowTypes() {
        return windowTypeRepository.findAll();
    }

    public WindowType createWindowType(String name) {
        if (windowTypeRepository.existsByName(name)) {
            throw new RuntimeException("Window type already exists");
        }

        WindowType windowType = new WindowType();
        windowType.setName(name);
        windowType.setCreatedAt(LocalDateTime.now());
        return windowTypeRepository.save(windowType);
    }

    public void deleteWindowType(String id) {
        if (!windowTypeRepository.existsById(id)) {
            throw new RuntimeException("Window type not found");
        }
        windowTypeRepository.deleteById(id);
    }
}